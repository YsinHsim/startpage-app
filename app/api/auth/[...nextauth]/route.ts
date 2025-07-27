import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define the authentication options
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      // Ensure these environment variables are correctly set in your .env.local
      // and are available to your Vercel deployment.
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add other providers here if you plan to support more login methods later
    // For example:
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),
  ],
  // Optional: Define callbacks for custom behavior during authentication
  callbacks: {
    // The signIn callback is called when a user attempts to sign in.
    // You can use this to perform actions like saving the user to your database
    // or checking if the user is allowed to sign in.
    async signIn({ user, account, profile, email, credentials }) {
      console.log("User signed in:", user);
      console.log("Account details:", account);
      // In a real application, you would typically check if the user exists in your
      // PostgreSQL database here. If not, you might create a new user record.
      // For now, we'll just allow all Google sign-ins.
      return true; // Return true to allow sign-in
    },
    // The session callback is called whenever a session is checked.
    // It's useful for adding custom data to the session object that can be
    // accessed client-side via useSession().
    async session({ session, token, user }) {
      // If you're using a database adapter, the 'user' object here will be
      // the user object from your database.
      // You can add custom properties to the session object.
      // For example, if you stored a 'role' in your user table:
      // if (user) {
      //   session.user.role = user.role;
      // }
      console.log("Session created/updated:", session);
      return session;
    },
    // The jwt callback is called whenever a JSON Web Token is created or updated.
    // This is useful for adding custom data to the JWT.
    async jwt({ token, user, account, profile, isNewUser }) {
      // If a user just signed in, the 'user' object will be available here.
      // You can add user ID or other data to the token.
      if (user) {
        token.id = user.id; // Add user ID to the token
      }
      console.log("JWT created/updated:", token);
      return token;
    },
  },
  // Optional: Configure the session strategy. 'jwt' is the default and recommended
  // for stateless sessions, especially when not using a database adapter initially.
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle the amount of time in seconds between session updates.
    // throttle: 60 * 60, // 1 hour
  },
  // Optional: Define custom pages for login, error, etc.
  // This allows you to use your /login page for authentication.
  pages: {
    signIn: "/login", // Redirects unauthenticated users to your custom login page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
  },
  // Optional: Enable debug messages in the console
  debug: process.env.NODE_ENV === "development",
};

// NextAuth.js handles the API routes for the App Router by exporting handlers
// for GET and POST requests.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
