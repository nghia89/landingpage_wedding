import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectMongo from '@/lib/mongodb';
import { User } from '@/models/User';

// Refresh access token function
async function refreshAccessToken(token: any) {
    try {
        // Connect to MongoDB to verify user still exists and is active
        await connectMongo();

        const user = await User.findById(token.sub);
        if (!user || user.role !== 'admin') {
            throw new Error('User not found or not admin');
        }

        // Generate new access token with extended expiry
        return {
            ...token,
            accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 1 day from now
            // Keep the same refresh token expiry
        };
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Connect to MongoDB
                    await connectMongo();

                    // Find user by email
                    const user = await User.findOne({ email: credentials.email.toLowerCase() });
                    if (!user) {
                        return null;
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        return null;
                    }

                    // Check if user is admin
                    if (user.role !== 'admin') {
                        return null;
                    }

                    // Return user object
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as const,
        maxAge: 24 * 60 * 60, // 1 day (86400 seconds)
    },
    callbacks: {
        async jwt({ token, user, account }: any) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    role: user.role,
                    accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
                    refreshTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days (refresh token vẫn giữ 7 ngày)
                };
            }

            // Return previous token if access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has expired, check if refresh token is still valid
            if (Date.now() < token.refreshTokenExpires) {
                // Refresh the access token
                return await refreshAccessToken(token);
            }

            // Both tokens expired, force re-login
            return {
                ...token,
                error: "RefreshTokenExpired",
            };
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.error = token.error;

                // Set session expires based on access token expiry
                if (token.accessTokenExpires) {
                    session.expires = new Date(token.accessTokenExpires).toISOString();
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
