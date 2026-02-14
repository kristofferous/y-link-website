"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/admin/actions";

const initialState = { status: "idle" as const, message: "" };

type Props = {
  locale: string;
  token: string;
};

export function AdminLoginForm({ locale, token }: Props) {
  const [state, formAction] = useActionState(adminLoginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="you@y-link.no"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
        />
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive-foreground">
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      >
        Sign in
      </button>
    </form>
  );
}
