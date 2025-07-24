import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        console.log("Middleware running for:", req.nextUrl.pathname);
        console.log("Token exists:", !!req.nextauth.token);
        console.log("User role:", req.nextauth.token?.role);
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                console.log("Auth check for:", pathname);
                console.log("Token:", !!token);
                console.log("Role:", token?.role);

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
