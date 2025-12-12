"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { InterestSignup } from "@/components/InterestSignup";

type ModalContextValue = {
  open: (context?: string) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function InterestSignupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<string | undefined>(undefined);

  const handleOpen = useCallback((source?: string) => {
    setContext(source);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    [handleOpen, handleClose],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {open ? (
        <InterestSignup
          variant="modal"
          contextSource={context ?? "modal"}
          onClose={handleClose}
        />
      ) : null}
    </ModalContext.Provider>
  );
}

export function useInterestModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useInterestModal must be used within InterestSignupProvider");
  }
  return ctx;
}
