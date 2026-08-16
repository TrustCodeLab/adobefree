"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Enforce restricted admin email
      if (email.trim().toLowerCase() !== "trustjonathan.ug@gmail.com") {
        setError("Access Denied: Restricted Email");
        setLoading(false);
        return;
      }

      // 2. Authenticate directly with Supabase
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 3. Success -> Route to Admin
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      console.error("Login exception:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#141414" }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(62,207,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(62,207,142,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo / Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={{
              backgroundColor: "#1c1c1c",
              borderColor: "#2e2e2e",
            }}
          >
            <Image
              src="/icon.png"
              alt="Adobe Free"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center space-y-1">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#ededef" }}
            >
              Admin Access
            </h1>
            <p className="text-sm" style={{ color: "#878c96" }}>
              Sign in to manage your store
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-xl border p-6 sm:p-8 space-y-6"
          style={{
            backgroundColor: "#1c1c1c",
            borderColor: "#2e2e2e",
          }}
        >
          {/* Error Message */}
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm text-center border animate-in fade-in duration-200"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold block"
                style={{ color: "#878c96" }}
                htmlFor="login-email"
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                disabled={loading}
                className="login-input w-full rounded-lg py-2.5 px-4 text-sm font-medium transition-all focus:outline-none disabled:opacity-50"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #2e2e2e",
                  color: "#ededef",
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold block"
                style={{ color: "#878c96" }}
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="login-input w-full rounded-lg py-2.5 px-4 text-sm font-medium transition-all focus:outline-none disabled:opacity-50"
                style={{
                  backgroundColor: "#141414",
                  border: "1px solid #2e2e2e",
                  color: "#ededef",
                }}
              />
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#3ecf8e",
                  color: "#141414",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#141414]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheckIcon className="w-3.5 h-3.5" style={{ color: "#3ecf8e" }} />
          <span className="text-xs" style={{ color: "#6b7280" }}>
            Restricted to authorized administrators only
          </span>
        </div>
      </div>

      <style jsx>{`
        .login-input::placeholder {
          color: #4b5563;
        }
        .login-input:focus {
          border-color: #3ecf8e !important;
          box-shadow: 0 0 0 1px #3ecf8e;
        }
      `}</style>
    </div>
  );
}
