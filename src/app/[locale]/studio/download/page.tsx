import { redirect } from "next/navigation"
import Link from "next/link"
import { validatePilotAccessByEmail } from "@/lib/pilotAccess"
import { getSessionFromCookie } from "@/lib/session"
import { logoutAction } from "@/app/access/actions"

export default async function DownloadPage() {
  const session = await getSessionFromCookie()
  if (!session || !session.email) {
    redirect(`/access?redirectTo=${encodeURIComponent("/studio/download")}`)
  }

  const pilot = await validatePilotAccessByEmail(session.email)
  if (!pilot.ok) {
    return (
      <main>
        <section className="section-spacing">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 space-y-4">
                <p className="text-label text-muted-foreground">Download</p>
                <h1 className="text-heading text-foreground">Access Not Active</h1>
              </div>

              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
                <p className="text-body text-muted-foreground">
                  Your access is not active or has expired. Contact Y-Link if you believe this is an error.
                </p>
                <Link
                  href="/access"
                  className="inline-flex items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                >
                  Back to access page
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">Download</p>
              <h1 className="text-heading text-foreground">Y-Link Studio</h1>
              <p className="text-body text-muted-foreground">
                Access verified. Download is delivered via protected endpoint. No direct links are exposed.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-6">
              <div className="space-y-4">
                <a
                  href="/api/download"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                >
                  Download (placeholder)
                </a>
                <p className="text-sm text-muted-foreground">
                  Your pilot type: {pilot.pilotType ?? "unknown"}. Access expires:{" "}
                  {pilot.expiresAt ? pilot.expiresAt : "no expiration date"}.
                </p>
              </div>

              <div className="border-t border-border/40 pt-6">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-border bg-accent px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
