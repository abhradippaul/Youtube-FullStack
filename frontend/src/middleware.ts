import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/sign-up/required-details"]);
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionId } = await auth();

    if (!sessionId) {
      NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // let isExist = null;

    //   if (sessionId) {
    //     isExist = (
    //       await axios.get(
    //         `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/user/is-exist?sessionId=${sessionId}`
    //       )
    //     ).data;
    //   }

    //   console.log("Middleware calling");

    //   if (!isExist?.isExist) {
    //     NextResponse.redirect(new URL("/sign-up/required-details", req.url));
    //   }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
