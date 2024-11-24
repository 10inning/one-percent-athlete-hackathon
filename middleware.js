import { NextResponse } from "next/server";
import { parse } from "cookie";

export async function middleware(req) {
  const cookies = req.headers.get("cookie");

  // Parse cookies
  let userCookie = null;
  if (cookies) {
    const parsedCookies = parse(cookies);
    userCookie = parsedCookies.user ? JSON.parse(parsedCookies.user) : null;
  }

  const { pathname } = req.nextUrl;

  if (userCookie) {
    // If the user is logged in, redirect `/` to `/profile`
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  } else {
    // If the user is not logged in, redirect `/profile` to `/`
    if (pathname === "/profile") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
