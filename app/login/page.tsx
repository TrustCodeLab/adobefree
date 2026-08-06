import { login } from "@/app/login/actions";
import Image from "next/image";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

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
          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm text-center border"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <form action={login} className="space-y-5">
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
                placeholder="example@gmail.com"
                className="login-input w-full rounded-lg py-2.5 px-4 text-sm font-medium transition-all focus:outline-none"
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
                placeholder="••••••••"
                className="login-input w-full rounded-lg py-2.5 px-4 text-sm font-medium transition-all focus:outline-none"
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
                className="w-full font-bold py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: "#3ecf8e",
                  color: "#141414",
                }}
              >
                Sign In
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

      <style>{`
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
