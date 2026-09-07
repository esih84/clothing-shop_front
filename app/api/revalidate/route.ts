import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Cache-busting hook the backend calls after the admin saves site settings, so
 * the change is visible immediately instead of at the next daily refresh.
 *
 * Guarded by a shared secret (`REVALIDATE_SECRET`, the same value the backend
 * sends). Without the variable set the route refuses every call rather than
 * becoming an open cache-flush endpoint.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, message: "revalidation is not configured" },
      { status: 503 },
    );
  }

  let body: { secret?: string; tag?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "invalid body" },
      { status: 400 },
    );
  }

  if (body.secret !== expected) {
    return NextResponse.json(
      { revalidated: false, message: "invalid secret" },
      { status: 401 },
    );
  }

  if (!body.tag) {
    return NextResponse.json(
      { revalidated: false, message: "missing tag" },
      { status: 400 },
    );
  }

  // Next 16 wants a cache-life profile alongside the tag; "max" expires the
  // entry outright, which is what a settings edit needs.
  revalidateTag(body.tag, "max");
  return NextResponse.json({ revalidated: true, tag: body.tag });
}
