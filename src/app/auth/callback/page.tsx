"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabase-client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = getSupabaseClient();
        
        // Check for error in URL first
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        if (error) {
          setStatus("error");
          setMessage(errorDescription || "Authentication failed");
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        // Get the next redirect path - default to /app
        const next = searchParams.get("next") || "/app";

        // @supabase/ssr automatically exchanges the code for a session
        // when detectSessionInUrl is true (which is the default)
        // We just need to wait a tick for it to complete, then check the session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setStatus("error");
          setMessage(sessionError.message);
          setTimeout(() => router.push("/"), 3000);
          return;
        }
        
        if (session) {
          setStatus("success");
          setMessage("Signed in! Redirecting...");
          setTimeout(() => router.push(next), 1000);
        } else {
          // No session yet, try once more after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          
          if (retrySession) {
            setStatus("success");
            setMessage("Signed in! Redirecting...");
            setTimeout(() => router.push(next), 1000);
          } else {
            setStatus("error");
            setMessage("Could not complete sign in. Please try again.");
            setTimeout(() => router.push("/"), 3000);
          }
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Authentication failed");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center max-w-md w-full border border-white/10"
      >
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 size={48} className="animate-spin text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-white/50 text-sm">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-emerald-400">Success!</h2>
            <p className="text-white/70">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle size={48} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">Error</h2>
            <p className="text-white/70">{message}</p>
            <p className="text-white/50 text-sm mt-4">Redirecting you back...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
