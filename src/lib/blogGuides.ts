import "server-only";

import { createServiceClient } from "@/lib/supabaseServer";
import { type AppLocale } from "@/lib/i18n/config";

const publishCutoff = () => new Date().toISOString().slice(0, 10);

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
