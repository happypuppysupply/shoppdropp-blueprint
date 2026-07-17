"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Shared configuration for cookie-based auth storage
// This ensures PKCE code verifier persists across OAuth redirects
export const createClient = (): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      storageKey: "sb-auth-token",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
    cookieOptions: {
      name: "sb-auth-token",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });
};

// Singleton instance for client-side use
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient can only be used in browser");
  }
  
  if (!clientInstance) {
    clientInstance = createClient();
  }
  
  return clientInstance;
};
