import { updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// On-demand ISR: Sanity fires a signed webhook on publish, we revalidate the
// "portfolio" cache tag so the next request rebuilds with fresh content.
// Configure the webhook at sanity.io/manage → API → Webhooks, pointing at
// /api/revalidate with the same secret as SANITY_REVALIDATE_SECRET.
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Bad request", { status: 400 });
    }

    updateTag("portfolio");
    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
