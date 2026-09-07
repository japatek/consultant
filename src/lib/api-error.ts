import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Shared by every thin route under app/api — maps the errors our action
 * functions throw (auth/role checks, Zod validation) to sensible HTTP
 * statuses instead of every route re-implementing the same if/else chain.
 */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Invalid input", issues: error.issues }, { status: 400 });
  }
  if (error instanceof Error) {
    if (error.message === "Not authenticated") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.message === "Admin access required") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error("Unexpected API error:", error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
