import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession['user'];
        error?: string;
    }

    interface User {
        role: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: string;
        accessTokenExpires: number;
        refreshTokenExpires: number;
        error?: string;
    }
}
