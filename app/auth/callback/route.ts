import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Use explicit app URL env variable to avoid localhost redirect issue
  // Fallback to derived origin if env is not set
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const origin = appUrl ? new URL(appUrl).origin : new URL(request.url).origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/admin/dashboard";
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  // Debug: Log all parameters
  console.log("=== Auth Callback Debug ===");
  console.log("URL:", request.url);
  console.log("Code present:", !!code);
  console.log("Next:", next);
  console.log("Error code:", errorCode);
  console.log("Error description:", errorDescription);
  console.log("===========================");

  // Jika ada error dari provider OAuth (bukan dari code exchange)
  if (errorCode || errorDescription) {
    console.error("OAuth provider error:", errorCode, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${errorCode}&description=${encodeURIComponent(errorDescription || "")}`,
    );
  }

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=no_code&description=No+authorization+code+received`,
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange code error:", error.message);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(error.message)}`,
      );
    }

    if (!data.session) {
      console.error("No session created");
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=no_session&description=Failed+to+create+session`,
      );
    }

    // Success - redirect to dashboard
    console.log("Session created successfully, redirecting to:", next);
    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("Callback exception:", err);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=exception&description=Unexpected+error+occurred`,
    );
  }
}
