"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, MessageCircle, CheckCircle2, Loader2 } from "lucide-react"
import { submitSupportRequest } from "./actions"

function SupportForm() {
  const searchParams = useSearchParams()
  const requestedApp = searchParams.get("request") || ""

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitSupportRequest(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setIsSuccess(true)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSuccess ? (
        <div className="glass-card rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-green-500/15 text-green-400 rounded-full p-4 mb-2 ring-1 ring-green-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Message Sent!</h2>
          <p className="text-muted text-sm leading-relaxed max-w-xs">
            Thank you for reaching out. Our team will review your request shortly.
          </p>
          <Link
            href="/"
            className="mt-4 bg-white hover:bg-white/90 text-black font-semibold h-11 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center text-sm"
          >
            Return Home
          </Link>
        </div>
      ) : (
        <form action={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-white/50">
              Your Name <span className="text-accent normal-case tracking-normal font-bold">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-white/50">
              Email Address <span className="text-accent normal-case tracking-normal font-bold">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-widest text-white/50">
              Message / Request <span className="text-accent normal-case tracking-normal font-bold">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              defaultValue={requestedApp ? `I would like to request the following application: ${requestedApp}` : ""}
              placeholder="I would like to request the following application..."
              className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300 resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold h-12 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm tracking-wide mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </>
  )
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 py-12 sm:p-8 md:p-16">
      <div className="w-full max-w-lg space-y-10">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-sm font-medium tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.18em]">
            Help Center
          </p>
          <h1 className="text-3xl sm:text-[2.6rem] font-bold tracking-tight leading-[1.15]">
            Support &amp; Requests
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-sm">
            Having an issue or want to request a new application?{" "}
            <span className="text-white/60">Send us a message below.</span>
          </p>
        </div>

        <Suspense fallback={
          <div className="glass-card rounded-2xl p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted" />
          </div>
        }>
          <SupportForm />
        </Suspense>
      </div>
    </div>
  )
}
