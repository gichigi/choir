import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';
import { api } from './convex/_generated/api';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Check if the user is authenticated
  const isAuthenticated = !!(await auth()).userId;

  // Only check subscription for authenticated users accessing dashboard
  if (isAuthenticated && req.nextUrl.href.includes('/dashboard')) {
    const token = (await (await auth()).getToken({ template: "convex" }));

    try {
      const { hasActiveSubscription } = await fetchQuery(api.subscriptions.getUserSubscriptionStatus, {}, {
        token: token!,
      });

      if (!hasActiveSubscription) {
        const pricingUrl = new URL('/pricing', req.nextUrl.origin);
        // Redirect to the pricing page
        return NextResponse.redirect(pricingUrl);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // If there's an error, redirect to pricing as a fallback
      const pricingUrl = new URL('/pricing', req.nextUrl.origin);
      return NextResponse.redirect(pricingUrl);
    }
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}