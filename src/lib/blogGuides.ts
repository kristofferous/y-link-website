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
  series_id: string | null;
  series_order: number | null;
};

type BlogPostTranslationRow = {
  slug: string;
  title: string;
  summary: string | null;
  content_html: string;
  seo_title: string | null;
  seo_description: string | null;
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

function mapPost(row: { post: BlogPostRow } & BlogPostTranslationRow): BlogPost {
  return {
    post: row.post,
    translation: {
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      content_html: row.content_html,
      seo_title: row.seo_title,
      seo_description: row.seo_description,
    },
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

export async function fetchBlogPostBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select(
      `
      slug,
      title,
      summary,
      content_html,
      seo_title,
      seo_description,
      post:blog_posts!inner(
        id,
        category,
        status,
        published_at,
        scheduled_at,
        reading_time,
        takeaway,
        featured_image_url,
        author_name,
        series_id,
        series_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("post.category", "blog")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" })
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapPost(data);
  const updatedPost = await promoteScheduledPostIfDue(supabase, mapped.post, now);
  return { ...mapped, post: updatedPost };
}

export async function fetchGuideBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select(
      `
      slug,
      title,
      summary,
      content_html,
      seo_title,
      seo_description,
      post:blog_posts!inner(
        id,
        category,
        status,
        published_at,
        scheduled_at,
        reading_time,
        takeaway,
        featured_image_url,
        author_name,
        series_id,
        series_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("post.category", "guide")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" })
    .is("post.series_id", null)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapPost(data);
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

export async function fetchGuideInSeries(
  locale: AppLocale,
  seriesId: string,
  slug: string,
): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select(
      `
      slug,
      title,
      summary,
      content_html,
      seo_title,
      seo_description,
      post:blog_posts!inner(
        id,
        category,
        status,
        published_at,
        scheduled_at,
        reading_time,
        takeaway,
        featured_image_url,
        author_name,
        series_id,
        series_order
      )
    `,
    )
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("post.category", "guide")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" })
    .eq("post.series_id", seriesId)
    .maybeSingle();

  if (error || !data) return null;
  const mapped = mapPost(data);
  const updatedPost = await promoteScheduledPostIfDue(supabase, mapped.post, now);
  return { ...mapped, post: updatedPost };
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
    .from("blog_post_translations")
    .select(
      `
      slug,
      title,
      summary,
      content_html,
      seo_title,
      seo_description,
      post:blog_posts!inner(
        id,
        category,
        status,
        published_at,
        scheduled_at,
        reading_time,
        takeaway,
        featured_image_url,
        author_name,
        series_id,
        series_order
      )
    `,
      { count: "exact" },
    )
    .eq("locale", locale)
    .eq("post.category", "blog")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" })
    .order("published_at", { ascending: false, foreignTable: "post" })
    .range(from, to);

  if (error || !data) {
    return { items: [], total: 0, page: safePage, pageSize: safePageSize };
  }

  const mapped = data.map(mapPost);
  const updatedPosts = await promoteScheduledPostsIfDue(
    supabase,
    mapped.map((item) => item.post),
    now,
  );
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  return {
    items: mapped.map((item) => ({ ...item, post: updatedById.get(item.post.id) ?? item.post })),
    total: count ?? data.length,
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
      .from("blog_post_translations")
      .select(
        `
        slug,
        title,
        summary,
        content_html,
        seo_title,
        seo_description,
        post:blog_posts!inner(
          id,
          category,
          status,
          published_at,
          scheduled_at,
          reading_time,
          takeaway,
          featured_image_url,
          author_name,
          series_id,
          series_order
        )
      `,
        { count: "exact" },
      )
      .eq("locale", locale)
      .eq("post.category", "guide")
      .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" })
      .order("published_at", { ascending: false, foreignTable: "post" })
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

  const mapped = data.map(mapPost);
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
    total: count ?? data.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

export async function fetchPublishedTranslations() {
  const supabase = createServiceClient();
  const now = new Date();
  const nowValue = nowIso();
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select(
      `
      slug,
      locale,
      post:blog_posts!inner(
        id,
        category,
        status,
        published_at,
        scheduled_at,
        series_id
      )
    `,
    )
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${nowValue})`, { foreignTable: "post" });

  if (error || !data) return [];

  const posts = data.map((row) => row.post);
  const updatedPosts = await promoteScheduledPostsIfDue(supabase, posts, now);
  const updatedById = new Map(updatedPosts.map((post) => [post.id, post]));

  return data.map((row) => ({ ...row, post: updatedById.get(row.post.id) ?? row.post }));
}

export async function fetchSeriesTranslations() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("series_id, slug, locale");

  if (error || !data) return [];
  return data;
}
