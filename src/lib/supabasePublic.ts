import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PublicClient = SupabaseClient;

function getSupabaseUrl() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getPublishableKey() {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (publishable) return publishable;

  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anon) return anon;

  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY fallback) environment variable",
  );
}

export function createPublicClient(): PublicClient {
  return createClient(getSupabaseUrl(), getPublishableKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
