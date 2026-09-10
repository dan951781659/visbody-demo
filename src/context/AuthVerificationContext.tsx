import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { AuthChannel } from "@/utils/authValidation";

export type AuthVerificationPurpose = "register" | "reset";

export type AuthVerificationSession = {
  purpose: AuthVerificationPurpose;
  identifier: string;
  channel: AuthChannel;
  verifiedAt: number;
};

type AuthVerificationContextValue = {
  session: AuthVerificationSession | null;
  setVerifiedSession: (session: Omit<AuthVerificationSession, "verifiedAt">) => void;
  clearVerification: () => void;
  hasVerifiedSession: (purpose: AuthVerificationPurpose, channel?: AuthChannel) => boolean;
};

const AuthVerificationContext = createContext<AuthVerificationContextValue | null>(null);

export function AuthVerificationProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthVerificationSession | null>(null);

  const setVerifiedSession = useCallback((next: Omit<AuthVerificationSession, "verifiedAt">) => {
    setSession({
      ...next,
      identifier: next.identifier.trim(),
      verifiedAt: Date.now(),
    });
  }, []);

  const clearVerification = useCallback(() => {
    setSession(null);
  }, []);

  const hasVerifiedSession = useCallback(
    (purpose: AuthVerificationPurpose, channel?: AuthChannel) => {
      if (!session) return false;
      if (session.purpose !== purpose) return false;
      if (channel && session.channel !== channel) return false;
      return Boolean(session.identifier);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      setVerifiedSession,
      clearVerification,
      hasVerifiedSession,
    }),
    [session, setVerifiedSession, clearVerification, hasVerifiedSession],
  );

  return (
    <AuthVerificationContext.Provider value={value}>{children}</AuthVerificationContext.Provider>
  );
}

export function useAuthVerification() {
  const context = useContext(AuthVerificationContext);
  if (!context) {
    throw new Error("useAuthVerification must be used within AuthVerificationProvider");
  }
  return context;
}
