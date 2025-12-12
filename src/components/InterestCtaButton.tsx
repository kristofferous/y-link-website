"use client";

import { type ReactNode } from "react";
import { useInterestModal } from "@/components/InterestSignupProvider";

type InterestCtaButtonProps = {
  context: string;
  children: ReactNode;
  className?: string;
};

export function InterestCtaButton({ context, children, className }: InterestCtaButtonProps) {
  const { open } = useInterestModal();
  return (
    <button
      className={className}
      onClick={() => open(context)}
      type="button"
    >
      {children}
    </button>
  );
}
