import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/all-classes/:path",
    "/member/dashboard",
    "/member/:path",
    "/trainner/:path",
    "/admin/:path",
    "/community-forum/:path",
  ],
};
