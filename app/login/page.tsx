"use client"; // Add this directive at the very top

import Link from 'next/link';
import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show a loading state while the session status is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white">
        <p className="text-xl">Loading authentication status...</p>
      </div>
    );
  }

  // If the user is already authenticated, redirect them to the dashboard
  // or provide an option to go to the dashboard/logout.
  if (session) {
    // Optionally, you can automatically redirect authenticated users to the dashboard.
    // Uncomment the line below if you prefer automatic redirection.
    // router.push('/dashboard');

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white
                      dark:from-gray-900 dark:to-black dark:text-gray-100">
        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md text-center space-y-6
                        dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">
          <h1 className="text-4xl font-bold text-blue-400">Welcome, {session.user?.name || 'User'}!</h1>
          <p className="text-gray-300 dark:text-gray-300">You are already logged in.</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900
                       dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-600 dark:focus:ring-offset-gray-900"
          >
            Logout
          </button>
          <Link href="/dashboard" className="text-blue-400 hover:underline mt-4 block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // If the user is not authenticated, show the login options.
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white
                    dark:from-gray-900 dark:to-black dark:text-gray-100">
      <div className="bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md text-center space-y-6
                      dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">
        <h1 className="text-4xl font-bold text-blue-400">Login</h1>
        <p className="text-gray-300 dark:text-gray-300">
          Sign in to access your personalized startpage.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center space-x-2
                     dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-900"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" className="w-5 h-5 filter invert dark:filter-none" />
          <span>Sign in with Google</span>
        </button>
        <p className="text-gray-400 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
        <Link href="/" className="text-gray-400 hover:underline mt-4 block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
