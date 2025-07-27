import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Import the Prisma adapter
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import { DefaultSession } from "next-auth"; // Import DefaultSession for type merging

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the authentication options
export const authOptions = {
  // Configure the Prisma adapter
  adapter: PrismaAdapter(prisma), // Add this line to integrate Prisma

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Optional: Define callbacks for custom behavior during authentication
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // With the Prisma adapter, NextAuth.js automatically handles
      // creating/updating the User and Account records in your database.
      // You can still add custom logic here if needed, e.g., for logging.
      console.log("User signed in:", user);
      console.log("Account details:", account);
      return true; // Return true to allow sign-in
    },
    async session({ session, token, user }) {
      // The 'user' object here is the User object from your database, provided by the adapter.
      // It will have the 'id' property from your database.
      // The 'token' object is the JWT created in the jwt callback.

      // Ensure session.user is properly populated with database user data.
      // This is the most common and robust way when using a database adapter.
      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          // Add any other custom fields from your User model here if needed
          // e.g., role: user.role,
        };
      } else if (token) {
        // Fallback to token data if for some reason 'user' is not available.
        // This might occur if the session strategy is 'jwt' and 'user' is only populated
        // on initial sign-in, or in specific edge cases.
        // Ensure token.id is treated as string.
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }


      console.log("Session created/updated:", session);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // When using a database adapter, the 'user' object in jwt callback is the database user object.
      // This callback is crucial for ensuring the JWT contains the database user ID.
      if (user) {
        token.id = user.id; // Add user ID from the database user object to the JWT
      }
      console.log("JWT created/updated:", token);
      return token;
    },
  },
  // When using a database adapter, the session strategy can be 'database' or 'jwt'.
  // 'database' stores session tokens in the database. 'jwt' stores them in a JWT.
  // For persistent login, 'jwt' is often preferred with a database adapter
  // as it avoids a database lookup on every request once the token is issued.
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days - default is 30 days
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Extend NextAuth.js types to include custom session properties (like user.id)
// This ensures TypeScript correctly recognizes the 'id' property on session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the 'id' property to the user object in the session
      // Add other custom properties from your User model here if needed
    } & DefaultSession["user"]; // Merge with default properties (name, email, image)
  }

  interface User {
    id: string; // Ensure User type includes 'id' as it comes from the database
    // Add other custom properties from your User model here if needed
  }
}

// Extend NextAuth.js JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add the 'id' property to the JWT token
  }
}
