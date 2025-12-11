"use client";

import { useActionState } from "react";

import { subscribeAction, type SubscriptionFormState } from "@/app/actions";
import { interestOptions, type InterestOption } from "@/lib/interest";

const initialState: SubscriptionFormState = {
  status: "idle",
  message: "",
};

type InterestFormProps = {
  defaultInterest?: InterestOption;
};

export function InterestForm({ defaultInterest }: InterestFormProps) {
  const [state, formAction] = useActionState(subscribeAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700"
            >
            Navn (valgfritt)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            placeholder="Navn"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700"
          >
            E-post
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            placeholder="navn@domene.no"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="interest_type"
            className="block text-sm font-medium text-neutral-700"
          >
            Hva slags interesse?
          </label>
          <select
            id="interest_type"
            name="interest_type"
            required
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            defaultValue={defaultInterest ?? ""}
          >
            <option value="" disabled>
              Velg et alternativ
            </option>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
        >
          Meld interesse
        </button>
        {state.message ? (
          <p
            className={`text-sm ${
              state.status === "success"
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <p className="text-xs text-neutral-600">
          Du kan få relevante oppdateringer om Y-Link. Du kan når som helst
          avslutte abonnementet via lenke i e-postene.
        </p>
      </div>
    </form>
  );
}
