import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/health",
    "/api/create-payment-intent",
    "/security",
    "/pricing"
  ],
  
  // Routes to ignore completely
  ignoredRoutes: [
    "/api/health",
    "/_next/static/(.*)",
    "/_next/image",
    "/favicon.ico",
    "/favicon.svg",
    "/icon-192.svg", 
    "/icon-512.svg",
    "/manifest.json",
    "/sw.js"
  ],
  
  // After authentication, redirect to analyzer page
  afterAuth(auth, req, evt) {
    // If user is signed in and trying to access sign-in/sign-up pages, redirect to analyzer
    if (auth.userId && (req.nextUrl.pathname.includes('/sign-in') || req.nextUrl.pathname.includes('/sign-up'))) {
      return Response.redirect(new URL('/analyzer', req.url));
    }
    
    // If user is not signed in and trying to access protected routes, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
