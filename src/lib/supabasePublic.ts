import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PublicClient = SupabaseClient;

function getSupabaseUrl() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getAnonKey() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function createPublicClient(): PublicClient {
  return createClient(getSupabaseUrl(), getAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
