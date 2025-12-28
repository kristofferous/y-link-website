import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { isSupportedLocale, type AppLocale } from "@/lib/i18n/config";

const BLOG_PREFIX = "/blog";
const GUIDES_PREFIX = "/guides";

type GuidePostLookup = {
  postId: number;
  seriesId: string | null;
};

function normalizePath(value: string | null): string {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
}

function parseGuideSegments(path: string) {
  const withoutPrefix = path.slice(GUIDES_PREFIX.length).replace(/^\//, "");
  if (!withoutPrefix) return [] as string[];
  return withoutPrefix.split("/").filter(Boolean);
}

function parseBlogSlug(path: string) {
  const withoutPrefix = path.slice(BLOG_PREFIX.length).replace(/^\//, "");
  return withoutPrefix.split("/").filter(Boolean)[0] ?? null;
}

async function fetchGuidePostBySlug(
  supabase: ReturnType<typeof createServiceClient>,
  locale: AppLocale,
  slug: string,
  seriesId?: string | null,
): Promise<GuidePostLookup | null> {
  let query = supabase
    .from("blog_post_translations")
    .select("post_id, post:blog_posts!inner(id, category, series_id)")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("post.category", "guide");

  if (seriesId) {
    query = query.eq("post.series_id", seriesId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  return {
    postId: data.post_id,
    seriesId: data.post.series_id,
  };
}

async function fetchBlogPostIdBySlug(
  supabase: ReturnType<typeof createServiceClient>,
  locale: AppLocale,
  slug: string,
) {
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select("post_id, post:blog_posts!inner(category)")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("post.category", "blog")
    .maybeSingle();

  if (error || !data) return null;
  return data.post_id as number;
}

async function fetchTranslationSlug(
  supabase: ReturnType<typeof createServiceClient>,
  postId: number,
  locale: AppLocale,
) {
  const { data, error } = await supabase
    .from("blog_post_translations")
    .select("slug")
    .eq("post_id", postId)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  return data.slug as string;
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const rawPath = normalizePath(searchParams.get("path"));

  if (!isSupportedLocale(from) || !isSupportedLocale(to)) {
    return NextResponse.json({ path: rawPath });
  }

  const fromLocale = from as AppLocale;
  const toLocale = to as AppLocale;

  if (rawPath.startsWith(BLOG_PREFIX)) {
    const slug = parseBlogSlug(rawPath);
    if (!slug) return NextResponse.json({ path: rawPath });

    const supabase = createServiceClient();
    const postId = await fetchBlogPostIdBySlug(supabase, fromLocale, slug);
    if (!postId) return NextResponse.json({ path: rawPath });

    const targetSlug = await fetchTranslationSlug(supabase, postId, toLocale);
    if (!targetSlug) return NextResponse.json({ path: BLOG_PREFIX });

    return NextResponse.json({ path: `${BLOG_PREFIX}/${targetSlug}` });
  }

  if (rawPath.startsWith(GUIDES_PREFIX)) {
    const segments = parseGuideSegments(rawPath);
    if (segments.length === 0) return NextResponse.json({ path: rawPath });

    const supabase = createServiceClient();

    if (segments.length === 1) {
      const lookup = await fetchGuidePostBySlug(supabase, fromLocale, segments[0]);
      if (!lookup) return NextResponse.json({ path: rawPath });

      const targetSlug = await fetchTranslationSlug(supabase, lookup.postId, toLocale);
      if (!targetSlug) return NextResponse.json({ path: GUIDES_PREFIX });

      if (lookup.seriesId) {
        const seriesSlug = await fetchSeriesSlug(supabase, lookup.seriesId, toLocale);
        if (!seriesSlug) return NextResponse.json({ path: GUIDES_PREFIX });
        return NextResponse.json({ path: `${GUIDES_PREFIX}/${seriesSlug}/${targetSlug}` });
      }

      return NextResponse.json({ path: `${GUIDES_PREFIX}/${targetSlug}` });
    }

    if (segments.length === 2) {
      const seriesSlug = segments[0];
      const postSlug = segments[1];
      const series = await supabase
        .from("guide_series_translations")
        .select("series_id")
        .eq("slug", seriesSlug)
        .eq("locale", fromLocale)
        .maybeSingle();

      if (series.error || !series.data) return NextResponse.json({ path: rawPath });

      const lookup = await fetchGuidePostBySlug(supabase, fromLocale, postSlug, series.data.series_id);
      if (!lookup) return NextResponse.json({ path: rawPath });

      const targetSlug = await fetchTranslationSlug(supabase, lookup.postId, toLocale);
      if (!targetSlug) return NextResponse.json({ path: GUIDES_PREFIX });

      const targetSeriesSlug = await fetchSeriesSlug(supabase, series.data.series_id, toLocale);
      if (!targetSeriesSlug) return NextResponse.json({ path: GUIDES_PREFIX });

      return NextResponse.json({ path: `${GUIDES_PREFIX}/${targetSeriesSlug}/${targetSlug}` });
    }
  }

  return NextResponse.json({ path: rawPath });
}
