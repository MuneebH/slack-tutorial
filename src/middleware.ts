import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
 
const isPublicPage = createRouteMatcher(["/auth"])

export default convexAuthNextjsMiddleware((request) => {
    if(!isPublicPage(request) && !isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }
    
    // if we're on a public page, and if we're authenticated, then redirect to the root page
    if (isPublicPage(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/") 
    }
    // TODO: Redirect user away from "/auth" if authenticated
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};