"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/common/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-gray-50">
      <Container size="md" className="py-16">
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" aria-hidden="true" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong!</h1>
          <p className="mb-6 text-gray-600">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              Go Home
            </Button>
          </div>
          {error.digest && <p className="mt-4 text-xs text-gray-500">Error ID: {error.digest}</p>}
        </div>
      </Container>
    </div>
  );
}
