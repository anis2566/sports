import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCurrent } from "./features/auth/server/action";
import { ROLE } from "./constant";

const protectedRoutes = ["/dashboard", "/seller"];

export async function middleware(request: NextRequest) {
  const user = await getCurrent();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isSellerRoute = request.nextUrl.pathname.startsWith("/seller");

  const isAdmin = user?.role === ROLE.Admin;
  const isSeller = user?.role === ROLE.Seller;

  if (!user && isProtected) {
    const signInUrl = new URL("/auth/sign-in", request.nextUrl);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    if (request.nextUrl.pathname !== "/auth/sign-in") {
      return NextResponse.redirect(signInUrl);
    }
  }

  if (isAdminRoute && !isAdmin) {
    const dashboardUrl = new URL("/", request.nextUrl);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isSellerRoute && !isSeller) {
    const sellerUrl = new URL("/seller/register", request.nextUrl);
    return NextResponse.redirect(sellerUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*"],
};
