import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const response = NextResponse.next();
  response.headers.set("x-is-mobile", isMobile ? "1" : "0");
  return response;
}

export const config = {
  matcher: ["/demos/aforce"],
};
