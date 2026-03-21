"use client";

import { useSearchParams } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState, Suspense } from "react";

function SessionManager({ token, user }: { token: string; user: any }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      const storeSession = async () => {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_EXPRESS_STORE_SESSION_URL || "http://localhost:4000/cli/store-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEXTJS_TO_EXPRESS_SECRET || "supersecret"}`,
              },
              body: JSON.stringify({
                token,
                user: {
                  id: user.id,
                  email: user.primaryEmailAddress?.emailAddress,
                  name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress,
                },
              }),
            }
          );

          if (response.ok) {
            setStatus("success");
          } else {
            const data = await response.json();
            setError(data.error || "Failed to store session");
            setStatus("error");
          }
        } catch (err) {
          setError("Network error connecting to backend");
          setStatus("error");
        }
      };

      storeSession();
    }
  }, [user, token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>
        <p className="text-zinc-600">Completing login for CLI...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-600">
        <p className="text-lg font-bold">Authentication Error</p>
        <p className="mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center text-5xl">✅</div>
      <h2 className="text-2xl font-bold text-green-600">Login Successful!</h2>
      <p className="mt-3 text-zinc-600 leading-relaxed">
        Your CLI has been authenticated as <span className="font-semibold text-zinc-900">{user.primaryEmailAddress?.emailAddress}</span>.
      </p>
      <p className="mt-4 text-sm text-zinc-500">
        You can now close this tab and return to your terminal.
      </p>
    </div>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isLoaded, isSignedIn, user } = useUser();

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 shadow-xl">
        <p className="text-center font-medium text-red-600">
          ❌ Invalid session. Please restart the login process from your CLI.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        <p className="text-zinc-500 font-medium">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {!isSignedIn ? (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-zinc-900">Welcome Back</h1>
            <p className="mt-2 text-zinc-500">Sign in to authorize your CLI session</p>
          </div>
          <SignIn routing="hash" appearance={{ elements: { rootBox: "mx-auto" } }} />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-100 bg-white p-10 shadow-2xl transition-all">
          <SessionManager token={token} user={user} />
        </div>
      )}
    </div>
  );
}

export default function CliLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
          <p className="text-zinc-500 font-medium">Initializing...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
      
      {/* Footer Branding */}
      <div className="mt-12 flex items-center gap-2 opacity-40 grayscale hover:opacity-100 transition-opacity">
        <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Powered by</p>
        <div className="h-4 w-12 bg-zinc-900 rounded-sm"></div>
      </div>
    </div>
  );
}
