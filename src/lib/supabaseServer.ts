import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServiceClient = SupabaseClient;

function getSupabaseUrl() {
  if (!process.env.SUPABASE_URL) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }

  return process.env.SUPABASE_URL;
}

function getServiceRoleKey() {
  const legacyKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!legacyKey && !secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) environment variable");
  }

  return secretKey ?? legacyKey;
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
