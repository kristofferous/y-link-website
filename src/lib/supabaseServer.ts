import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServiceClient = SupabaseClient;

function getSupabaseUrl() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSecretKey() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY environment variable");
  }

  return secretKey;
}

export function createServiceClient(): ServiceClient {
  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceRoleKey = getSecretKey();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
