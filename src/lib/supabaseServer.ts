import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServiceClient = SupabaseClient<
  any,
  "public",
  any
>;

function getSupabaseUrl() {
  if (!process.env.SUPABASE_URL) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }

  return process.env.SUPABASE_URL;
}

function getServiceRoleKey() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function createServiceClient(): ServiceClient {
  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceRoleKey = getServiceRoleKey();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
