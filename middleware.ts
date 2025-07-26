import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // Middleware for NextAuth.js authentication
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow access to login page always
                if (pathname === "/admin/login") {
                    return true;
                }

                // For admin routes, require authentication and admin role
                if (pathname.startsWith("/admin")) {
                    return !!token && token.role === "admin";
                }

                // Allow access to all other routes
                return true;
            },
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"]
};
