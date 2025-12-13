import { randomUUID } from "crypto"
import type { Metadata } from "next"
import Link from "next/link"
import { createServiceClient } from "@/lib/supabaseServer"

export const metadata: Metadata = {
  title: "Unsubscribe | Y-Link",
  description: "Unsubscribe from Y-Link updates.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/unsubscribe",
  },
}

type UnsubscribeResult = { status: "success"; message: string } | { status: "error"; message: string }

async function handleUnsubscribe(token: string | undefined): Promise<UnsubscribeResult> {
  if (!token) {
    return { status: "error", message: "The link is not valid." }
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("email_subscriptions")
      .update({
        subscribed: false,
        unsubscribe_token: randomUUID(),
      })
      .eq("unsubscribe_token", token)
      .select("email")
      .maybeSingle()

    if (error) {
      console.error(error)
      return {
        status: "error",
        message: "Something went wrong. Please try again later.",
      }
    }

    if (!data) {
      return {
        status: "error",
        message: "The link has expired or has already been used.",
      }
    }

    return {
      status: "success",
      message: "You have been unsubscribed from Y-Link emails.",
    }
  } catch (error) {
    console.error(error)
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    }
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const tokenParam = params.token
  const token = typeof tokenParam === "string" ? tokenParam : Array.isArray(tokenParam) ? tokenParam[0] : undefined

  const result = await handleUnsubscribe(token)

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">Email Preferences</p>
              <h1 className="text-heading text-foreground">Unsubscribe</h1>
            </div>

            <div
              className={`rounded-xl border p-6 ${
                result.status === "success" ? "border-primary/40 bg-card" : "border-destructive/40 bg-card"
              }`}
            >
              <p className="text-body text-foreground">{result.message}</p>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Unsubscribed by mistake?{" "}
              <Link href="/" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80">
                Sign up again on the homepage
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
