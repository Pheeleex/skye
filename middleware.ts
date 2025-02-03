import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptKey } from './lib/utils';

export function middleware(req: NextRequest) {
  const adminAccess = req.cookies.get('accessKey')?.value;
  // Determine the current path
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');

  // Check if the request path is a protected path
  if (isAdminPath) {
    if (adminAccess) {
      const decryptedKey = decryptKey(adminAccess);
      
      // Check if accessKey is valid
      if (decryptedKey && decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        return NextResponse.next(); // Allow admin access
      }
    }

 // Redirect to homepage if admin access is not authorized
 return NextResponse.redirect(new URL('/', req.url));
}
}

// You can add config if you want to enable the middleware for specific routes
export const config = {
  matcher: ['/admin/:path*'], // Apply this middleware to all routes under /admin
};
