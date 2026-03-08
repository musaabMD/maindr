"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/** Temporary debug page - DELETE after fixing auth. Visit /debug-auth when signed in. */
export default function DebugAuthPage() {
  const { isSignedIn, getToken } = useAuth();
  const [payload, setPayload] = useState<{ iss?: string; aud?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !getToken) return;
    getToken({ template: "convex", skipCache: true })
      .then((token) => {
        if (!token) {
          setError("getToken returned null");
          return;
        }
        try {
          const parts = token.split(".");
          if (parts.length !== 3) {
            setError("Invalid JWT format");
            return;
          }
          const decoded = JSON.parse(atob(parts[1]));
          setPayload({ iss: decoded.iss, aud: decoded.aud });
        } catch (e) {
          setError(String(e));
        }
      })
      .catch((e) => setError(String(e)));
  }, [isSignedIn, getToken]);

  const expected = {
    iss: "https://nice-weevil-50.clerk.accounts.dev",
    aud: "convex",
  };

  return (
    <div className="p-8 font-mono text-sm max-w-2xl">
      <h1 className="text-lg font-bold mb-4">Auth Debug (delete this page after fixing)</h1>
      {!isSignedIn && <p className="text-amber-600">Sign in first, then refresh.</p>}
      {isSignedIn && (
        <>
          <p className="mb-2">Your token claims:</p>
          <pre className="bg-gray-100 p-4 rounded mb-4">
            {payload ? JSON.stringify(payload, null, 2) : error ?? "Loading..."}
          </pre>
          {payload && (
            <div className="space-y-2">
              <p>
                <strong>iss</strong> matches expected?{" "}
                {payload.iss === expected.iss ? "✅" : `❌ (expected: ${expected.iss})`}
              </p>
              <p>
                <strong>aud</strong> matches expected?{" "}
                {payload.aud === expected.aud ? "✅" : `❌ (expected: "${expected.aud}")`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
