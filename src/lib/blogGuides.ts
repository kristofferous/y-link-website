import "server-only";

import { createServiceClient } from "@/lib/supabaseServer";
import { type AppLocale } from "@/lib/i18n/config";

const publishCutoff = () => new Date().toISOString().slice(0, 10);

const PAGE_SIZE_FALLBACK = 9;

type BlogPostRow = {
  id: number;
  category: "blog" | "guide";
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
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

export async function fetchBlogPostBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
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
    .eq("post.status", "published")
    .lte("post.published_at", publishCutoff())
    .maybeSingle();

  if (error || !data) return null;
  return mapPost(data);
}

export async function fetchGuideBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
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
    .eq("post.status", "published")
    .lte("post.published_at", publishCutoff())
    .is("post.series_id", null)
    .maybeSingle();

  if (error || !data) return null;
  return mapPost(data);
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
    .eq("post.status", "published")
    .lte("post.published_at", publishCutoff())
    .eq("post.series_id", seriesId)
    .maybeSingle();

  if (error || !data) return null;
  return mapPost(data);
}

export async function fetchBlogList(
  locale: AppLocale,
  page: number,
  pageSize = PAGE_SIZE_FALLBACK,
): Promise<PaginatedResult<BlogListItem>> {
  const supabase = createServiceClient();
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
    .eq("post.status", "published")
    .lte("post.published_at", publishCutoff())
    .order("published_at", { ascending: false, foreignTable: "post" })
    .range(from, to);

  if (error || !data) {
    return { items: [], total: 0, page: safePage, pageSize: safePageSize };
  }

  return {
    items: data.map(mapPost),
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
      .eq("post.status", "published")
      .lte("post.published_at", publishCutoff())
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

  const items = data
    .map((row) => {
      const post = mapPost(row);
      if (!post.post.series_id) return { ...post, seriesSlug: null };
      const seriesSlug = seriesSlugById.get(post.post.series_id) ?? null;
      return { ...post, seriesSlug };
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
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select(
      `
      slug,
      locale,
      post:blog_posts!inner(
        category,
        status,
        published_at,
        series_id
      )
    `,
    )
    .eq("post.status", "published")
    .lte("post.published_at", publishCutoff());

  if (error || !data) return [];
  return data;
}

export async function fetchSeriesTranslations() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("guide_series_translations")
    .select("series_id, slug, locale");

  if (error || !data) return [];
  return data;
}
