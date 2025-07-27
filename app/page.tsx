import Link from 'next/link';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ColorModeToggle"; // Import your ModeToggle component

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4
                    bg-gradient-to-br from-blue-900 to-purple-900 text-white
                    dark:from-gray-900 dark:to-black dark:text-gray-100">

      {/* Theme Toggle Button - Placed in the top right corner */}
      <div className="absolute top-4 right-4 z-20"> {/* Added z-index to ensure it's above other elements */}
        <ModeToggle />
      </div>

      <div className="relative z-10 text-center space-y-6 p-8
                      bg-black bg-opacity-40 rounded-xl shadow-2xl border border-gray-700
                      dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
          Welcome to Your Personalized Startpage!
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto dark:text-gray-300">
          Organize your digital life with custom links, search engines, and beautiful wallpapers, all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          {/* Using shadcn Button with Next.js Link */}
          <Button
            asChild
            size="lg"
          >
            <Link
              href="/login"
              className="px-8 py-4 font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                         bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-900
                         dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-900"
            >
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                         bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-900
                         dark:bg-purple-700 dark:text-white dark:hover:bg-purple-800 dark:focus:ring-purple-600 dark:focus:ring-offset-gray-900"
            >
              Go to Dashboard (for existing users)
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
