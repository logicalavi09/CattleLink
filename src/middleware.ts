import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/api/cattle(.*)", "/api/ai(.*)", "/api/inquiries(.*)", "/community"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.[\\w]+$).*)", "/(api|trpc)(.*)"],
};
