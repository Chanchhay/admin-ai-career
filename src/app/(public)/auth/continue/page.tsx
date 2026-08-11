"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";

export default function AuthContinuePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-4 py-16">
          <LoadingState rows={3} />
        </main>
      }
    >
      <AuthContinue />
    </Suspense>
  );
}

function AuthContinue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useGetCurrentUserQuery();

  useEffect(() => {
    if (!currentUser.data) return;

    // Set when the proxy bounced a visitor here from a protected page.
    const next = searchParams.get("next");
    if (next?.startsWith("/") && !next.startsWith("//")) {
      router.replace(next);
      return;
    }

    const roles = currentUser.data.roles.map((role) => role.toUpperCase());
    router.replace(
      roles.some((role) => role.includes("ADMIN"))
        ? "/admin/dashboard"
        : roles.some((role) => role.includes("RECRUITER"))
        ? "/recruiter/dashboard"
        : "/job-seeker/dashboard",
    );
  }, [currentUser.data, router, searchParams]);

  if (currentUser.isError) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <ErrorState message="Unable to finish signing in." />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <LoadingState rows={3} />
    </main>
  );
}
