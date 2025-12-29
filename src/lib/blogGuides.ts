import "server-only";

import { createServiceClient } from "@/lib/supabaseServer";
import { type AppLocale } from "@/lib/i18n/config";

const nowIso = () => new Date().toISOString();
const todayDate = () => new Date().toISOString().slice(0, 10);

const PAGE_SIZE_FALLBACK = 9;

type BlogPostRow = {
  id: number;
  category: "blog" | "guide";
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  scheduled_at: string | null;
  reading_time: string | null;
  takeaway: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  series_id: string | null;
  series_order: number | null;
  prev_guide_id?: number | null;
  next_guide_id?: number | null;
};

type BlogPostTranslationRow = {
  slug: string;
  title: string;
  summary: string | null;
  content_html: string;
  seo_title: string | null;
  seo_description: string | null;
  locale?: string;
};

type JoinedPostRow = BlogPostRow & {
  translations: BlogPostTranslationRow[];
};

export type BlogPost = {
  post: BlogPostRow;
  translation: BlogPostTranslationRow;
};

export type GuideSeries = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type GuideSeriesListItem = Pick<GuideSeries, "id" | "name" | "slug" | "description">;

export type BlogListItem = BlogPost;

export type GuideListItem = BlogPost & {
  seriesSlug?: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

function mapJoined(row: JoinedPostRow): BlogPost | null {
  const translation = row.translations?.[0];
  if (!translation) return null;
  const { translations, ...post } = row;
  return {
    post: post as BlogPostRow,
    translation,
  };
}

function toRange(page: number, pageSize = PAGE_SIZE_FALLBACK) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  return { from, to, page: safePage, pageSize: safePageSize };
}

function isScheduledDue(post: BlogPostRow, now: Date) {
  if (post.status !== "scheduled" || !post.scheduled_at) return false;
  return new Date(post.scheduled_at) <= now;
}

function publishedAtFromSchedule(scheduledAt: string | null) {
  if (!scheduledAt) return todayDate();
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return todayDate();
  return date.toISOString().slice(0, 10);
}

async function promoteScheduledPostIfDue(
  supabase: ReturnType<typeof createServiceClient>,
  post: BlogPostRow,
  now: Date,
): Promise<BlogPostRow> {
  if (!isScheduledDue(post, now)) return post;

  const published_at = post.published_at ?? publishedAtFromSchedule(post.scheduled_at);
  const { error } = await supabase
    .from("blog_posts")
    .update({ status: "published", published_at })
    .eq("id", post.id);

  if (error) return post;

  return { ...post, status: "published", published_at };
}

async function promoteScheduledPostsIfDue(
  supabase: ReturnType<typeof createServiceClient>,
  posts: BlogPostRow[],
  now: Date,
) {
  const duePosts = posts.filter((post) => isScheduledDue(post, now));
  if (duePosts.length === 0) return posts;

  const updates = await Promise.all(duePosts.map((post) => promoteScheduledPostIfDue(supabase, post, now)));
  const updatedById = new Map(updates.map((post) => [post.id, post]));

  return posts.map((post) => updatedById.get(post.id) ?? post);
}

function eligibilityFilter(nowValue: string) {
  return `status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`;
}

async function fetchSeriesSlug(
  supabase: ReturnType<typeof createServiceClient>,
  seriesId: string,
  locale: AppLocale,
) {
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("slug")
    .eq("series_id", seriesId)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  return data.slug as string;
}

export async function fetchBlogPostBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      reading_time,
      takeaway,
      featured_image_url,
      author_name,
      author:users!blog_posts_author_id_fkey(
        full_name,
        avatar_url
      ),
      prev_guide_id,
      next_guide_id,
      series_id,
      series_order,
      translations:blog_post_translations!inner(
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        locale
      )
    `,
    )
    .eq("category", "blog")
    .or(eligibilityFilter(nowValue))
    .eq("translations.slug", slug)
    .eq("translations.locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapJoined(data as JoinedPostRow);
  if (!mapped) return null;
  const updatedPost = await promoteScheduledPostIfDue(supabase, mapped.post, now);
  return { ...mapped, post: updatedPost };
}

export async function fetchGuideBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      reading_time,
      takeaway,
      featured_image_url,
      author_name,
      author:users!blog_posts_author_id_fkey(
        full_name,
        avatar_url
      ),
      prev_guide_id,
      next_guide_id,
      series_id,
      series_order,
      translations:blog_post_translations!inner(
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        locale
      )
    `,
    )
    .eq("category", "guide")
    .or(eligibilityFilter(nowValue))
    .is("series_id", null)
    .eq("translations.slug", slug)
    .eq("translations.locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapJoined(data as JoinedPostRow);
  if (!mapped) return null;
  const updatedPost = await promoteScheduledPostIfDue(supabase, mapped.post, now);
  return { ...mapped, post: updatedPost };
}

export async function fetchGuideSeries(locale: AppLocale, seriesSlug: string): Promise<GuideSeries | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("series_id, name, slug, description, seo_title, seo_description")
    .eq("slug", seriesSlug)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.series_id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
  };
}

export async function fetchGuideSeriesList(locale: AppLocale): Promise<GuideSeriesListItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("series_id, name, slug, description")
    .eq("locale", locale)
    .order("name", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.series_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
  }));
}

export async function fetchGuideInSeries(
  locale: AppLocale,
  seriesId: string,
  slug: string,
): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      reading_time,
      takeaway,
      featured_image_url,
      author_name,
      author:users!blog_posts_author_id_fkey(
        full_name,
        avatar_url
      ),
      prev_guide_id,
      next_guide_id,
      series_id,
      series_order,
      translations:blog_post_translations!inner(
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        locale
      )
    `,
    )
    .eq("category", "guide")
    .or(eligibilityFilter(nowValue))
    .eq("series_id", seriesId)
    .eq("translations.slug", slug)
    .eq("translations.locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapJoined(data as JoinedPostRow);
  if (!mapped) return null;
  const updatedPost = await promoteScheduledPostIfDue(supabase, mapped.post, now);
  return { ...mapped, post: updatedPost };
}

export async function fetchGuidesForSeries(locale: AppLocale, seriesId: string): Promise<GuideListItem[]> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      reading_time,
      takeaway,
      featured_image_url,
      author_name,
      author:users!blog_posts_author_id_fkey(
        full_name,
        avatar_url
      ),
      prev_guide_id,
      next_guide_id,
      series_id,
      series_order,
      translations:blog_post_translations!inner(
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        locale
      )
    `,
    )
    .eq("category", "guide")
    .or(eligibilityFilter(nowValue))
    .eq("series_id", seriesId)
    .eq("translations.locale", locale)
    .order("series_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error || !data) return [];

  const mapped = data
    .map((row) => mapJoined(row as JoinedPostRow))
    .filter((item): item is BlogPost => Boolean(item));
  const updatedPosts = await promoteScheduledPostsIfDue(
    supabase,
    mapped.map((item) => item.post),
    now,
  );
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  return mapped.map((item) => ({
    ...item,
    post: updatedById.get(item.post.id) ?? item.post,
    seriesSlug: null,
  }));
}

export async function fetchGuideNavItem(locale: AppLocale, postId: number) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      series_id,
      translations:blog_post_translations!inner(
        slug,
        title,
        locale
      )
    `,
    )
    .eq("id", postId)
    .eq("category", "guide")
    .eq("translations.locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  const translation = data.translations?.[0];
  if (!translation) return null;

  let path = `/guides/${translation.slug}`;
  if (data.series_id) {
    const seriesSlug = await fetchSeriesSlug(supabase, data.series_id, locale);
    if (seriesSlug) {
      path = `/guides/${seriesSlug}/${translation.slug}`;
    }
  }

  return {
    title: translation.title,
    path,
  };
}

export async function fetchBlogList(
  locale: AppLocale,
  page: number,
  pageSize = PAGE_SIZE_FALLBACK,
): Promise<PaginatedResult<BlogListItem>> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { from, to, page: safePage, pageSize: safePageSize } = toRange(page, pageSize);

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      reading_time,
      takeaway,
      featured_image_url,
      author_name,
      author:users!blog_posts_author_id_fkey(
        full_name,
        avatar_url
      ),
      prev_guide_id,
      next_guide_id,
      series_id,
      series_order,
      translations:blog_post_translations!inner(
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        locale
      )
    `,
      { count: "exact" },
    )
    .eq("category", "blog")
    .or(eligibilityFilter(nowValue))
    .eq("translations.locale", locale)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    return { items: [], total: 0, page: safePage, pageSize: safePageSize };
  }

  const mapped = data
    .map((row) => mapJoined(row as JoinedPostRow))
    .filter((item): item is BlogPost => Boolean(item));
  const updatedPosts = await promoteScheduledPostsIfDue(
    supabase,
    mapped.map((item) => item.post),
    now,
  );
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  return {
    items: mapped.map((item) => ({ ...item, post: updatedById.get(item.post.id) ?? item.post })),
    total: count ?? mapped.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

export async function fetchGuideList(
  locale: AppLocale,
  page: number,
  pageSize = PAGE_SIZE_FALLBACK,
): Promise<PaginatedResult<GuideListItem>> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { from, to, page: safePage, pageSize: safePageSize } = toRange(page, pageSize);

  const [seriesTranslations, guideResponse] = await Promise.all([
    fetchSeriesTranslations(),
    supabase
      .from("blog_posts")
      .select(
        `
        id,
        category,
        status,
        published_at,
        scheduled_at,
        reading_time,
        takeaway,
        featured_image_url,
        author_name,
        author:users!blog_posts_author_id_fkey(
          full_name,
          avatar_url
        ),
        prev_guide_id,
        next_guide_id,
        series_id,
        series_order,
        translations:blog_post_translations!inner(
          slug,
          title,
          summary,
          content_html,
          seo_title,
          seo_description,
          locale
        )
      `,
        { count: "exact" },
      )
      .eq("category", "guide")
      .or(eligibilityFilter(nowValue))
      .is("series_id", null)
      .eq("translations.locale", locale)
      .order("published_at", { ascending: false })
      .range(from, to),
  ]);

  const seriesSlugById = new Map<string, string>();
  for (const series of seriesTranslations) {
    if (series.locale !== locale) continue;
    seriesSlugById.set(series.series_id, series.slug);
  }

  const { data, error, count } = guideResponse;

  if (error || !data) {
    return { items: [], total: 0, page: safePage, pageSize: safePageSize };
  }

  const mapped = data
    .map((row) => mapJoined(row as JoinedPostRow))
    .filter((item): item is BlogPost => Boolean(item));
  const updatedPosts = await promoteScheduledPostsIfDue(
    supabase,
    mapped.map((item) => item.post),
    now,
  );
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  const items = mapped
    .map((item) => {
      const post = updatedById.get(item.post.id) ?? item.post;
      if (!post.series_id) return { ...item, post, seriesSlug: null };
      const seriesSlug = seriesSlugById.get(post.series_id) ?? null;
      return { ...item, post, seriesSlug };
    })
    .filter((item) => (item.post.series_id ? Boolean(item.seriesSlug) : true));

  return {
    items,
    total: count ?? mapped.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

export async function fetchPublishedTranslations() {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      category,
      status,
      published_at,
      scheduled_at,
      series_id,
      translations:blog_post_translations!inner(
        slug,
        locale
      )
    `,
    )
    .or(eligibilityFilter(nowValue));

  if (error || !data) return [];

  const posts = data.map((row) => row as JoinedPostRow);
  const updatedPosts = await promoteScheduledPostsIfDue(
    supabase,
    posts.map((row) => row as BlogPostRow),
    now,
  );
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  return posts.flatMap((row) => {
    const post = updatedById.get(row.id) ?? (row as BlogPostRow);
    return row.translations.map((translation) => ({
      slug: translation.slug,
      locale: translation.locale,
      post,
    }));
  });
}

export async function fetchSeriesTranslations() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("series_id, slug, locale");

  if (error || !data) return [];
  return data;
}
