"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard browser client - PKCE verifier stored in cookies automatically by @supabase/ssr
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Singleton instance for client-side use
let clientInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient can only be used in browser");
  }
  
  if (!clientInstance) {
    clientInstance = createClient();
  }
  
  return clientInstance;
};
