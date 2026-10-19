import { ClerkProvider } from "@clerk/react";
import type { ReactNode } from "react";

interface ClerkSetupProps {
  children: ReactNode;
}

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function ClerkSetup({ children }: ClerkSetupProps) {
  if (!publishableKey) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in frontend/.env");
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
  );
}
