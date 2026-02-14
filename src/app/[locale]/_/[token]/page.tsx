import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLoginForm } from "./AdminLoginForm";
import { getAdminLoginToken } from "@/lib/adminAccess";
import { normalizeLocale, type AppLocale } from "@/lib/i18n/config";

type PageProps = {
  params: Promise<{ locale: AppLocale; token: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Login",
    robots: { index: false, follow: false },
  };
}

export default async function HiddenAdminLoginPage({ params }: PageProps) {
  const { locale: localeParam, token } = await params;
  const locale = normalizeLocale(localeParam);
  const expectedToken = getAdminLoginToken();

  if (!expectedToken || token !== expectedToken) {
    notFound();
  }

  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 space-y-4">
              <p className="text-label text-muted-foreground">Restricted</p>
              <h1 className="text-heading text-foreground">Admin Sign In</h1>
              <p className="text-body text-muted-foreground">Authorized personnel only.</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-6">
              <AdminLoginForm locale={locale} token={token} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
