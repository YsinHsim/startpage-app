"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Import your existing components
// UserProfile will be simplified inline for the profile picture next to the clock
// WallpaperSetter is now used inside a dropdown
import SearchBar from '@/components/SearchBar';
// LinkGroupsDisplay is no longer used directly, its functionality is in dropdowns
import { ModeToggle } from "@/components/ColorModeToggle";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

// Mock Data for demonstration purposes
// In a real application, this data would come from your PostgreSQL database,
// fetched based on the authenticated user's ID.

// Mock User Data
const mockUser = {
  id: 'user-123',
  username: 'JohnDoe',
  email: 'john.doe@example.com',
  profilePictureUrl: 'https://placehold.co/100x100/A0CED9/000000?text=JD', // Placeholder image
  currentWallpaperUrl: 'https://placehold.co/1920x1080/4A4E69/FFFFFF?text=Your+Wallpaper', // Default wallpaper
};

// Mock Search Engines
const mockSearchEngines = [
  { id: 'se-google', name: 'Google', baseUrl: 'https://www.google.com/search?q=', isDefault: true },
  { id: 'se-duckduckgo', name: 'DuckDuckGo', baseUrl: 'https://duckduckgo.com/?q=', isDefault: true },
  { id: 'se-bing', name: 'https://www.bing.com/search?q=', isDefault: true }, // Corrected base_url for Bing
  { id: 'se-custom', name: 'My Custom Search', baseUrl: 'https://example.com/search?query=', isDefault: false },
];

// Mock Link Groups and Links (filtered for specific dropdowns)
const mockLinkGroups = [
  {
    id: 'lg-social',
    name: 'Social Media',
    isDefault: true,
    displayOrder: 1,
    links: [
      { id: 'link-fb', name: 'Facebook', url: 'https://www.facebook.com/', iconUrl: 'https://lucide.dev/icons/facebook.svg' },
      { id: 'link-x', name: 'X (Twitter)', url: 'https://x.com/', iconUrl: 'https://lucide.dev/icons/twitter.svg' },
      { id: 'link-ig', name: 'Instagram', url: 'https://www.instagram.com/', iconUrl: 'https://lucide.dev/icons/instagram.svg' },
    ],
  },
  {
    id: 'lg-ai',
    name: 'AI Assistant',
    isDefault: true,
    displayOrder: 2,
    links: [
      { id: 'link-chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com/', iconUrl: 'https://lucide.dev/icons/bot.svg' },
      { id: 'link-gemini', name: 'Gemini', url: 'https://gemini.google.com/', iconUrl: 'https://lucide.dev/icons/sparkles.svg' },
    ],
  },
  {
    id: 'lg-entertainment',
    name: 'Entertainment',
    isDefault: true,
    displayOrder: 3,
    links: [
      { id: 'link-yt', name: 'YouTube', url: 'https://www.youtube.com/', iconUrl: 'https://lucide.dev/icons/youtube.svg' },
      { id: 'link-netflix', name: 'Netflix', url: 'https://www.netflix.com/', iconUrl: 'https://lucide.dev/icons/film.svg' },
    ],
  },
];

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for dashboard features
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<typeof mockSearchEngines[0]>(mockSearchEngines[0]);
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(mockUser.currentWallpaperUrl);
  const [newWallpaperInput, setNewWallpaperInput] = useState<string>('');

  // Effect to handle authentication redirection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // Effect to set initial wallpaper from mock user data
  useEffect(() => {
    setWallpaperUrl(mockUser.currentWallpaperUrl);
  }, []);

  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && selectedSearchEngine) {
      const searchUrl = `${selectedSearchEngine.baseUrl}${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, '_blank');
    }
  };

  // Function to save wallpaper URL (mock implementation)
  const handleSaveWallpaper = () => {
    if (newWallpaperInput.trim()) {
      setWallpaperUrl(newWallpaperInput);
      console.log('Saving new wallpaper URL:', newWallpaperInput);
      setNewWallpaperInput('');
    }
  };

  // Helper to render links within a dropdown
  const renderLinksInDropdown = (groupName: string) => {
    const group = mockLinkGroups.find(g => g.name === groupName);
    if (!group) return null;

    return (
      <>
        <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {group.links.map((link) => (
          <DropdownMenuItem key={link.id} asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
              {link.iconUrl && (
                <img
                  src={link.iconUrl}
                  alt={`${link.name} icon`}
                  className="w-4 h-4 filter invert dark:filter-none"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <span>{link.name}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </>
    );
  };

  // Show loading state while session is being checked
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white
                      dark:from-gray-900 dark:to-black dark:text-gray-100">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  // Only render dashboard content if authenticated
  if (session) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      >
        {/* Overlay for better readability on wallpaper */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Top Bar */}
        <div className="absolute top-4 w-full flex justify-between items-center px-4 z-20">
          {/* Top Left: Home Button */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="px-4 py-2 bg-gray-700 bg-opacity-70 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
              &larr; Home
            </Link>
          </div>

          {/* Top Right: Search Engine Dropdown, Link Group Dropdowns, Wallpaper Dropdown, and Theme Toggle */}
          <div className="flex items-center space-x-2">
            {/* Search Engine Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600">
                  <span role="img" aria-label="search engine icon">🔍</span> {/* Search icon */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Search Engine</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockSearchEngines.map((engine) => (
                  <DropdownMenuItem
                    key={engine.id}
                    onClick={() => setSelectedSearchEngine(engine)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{engine.name}</span>
                    {selectedSearchEngine.id === engine.id && (
                      <span className="ml-auto text-blue-500">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Social Media Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600">
                  <span role="img" aria-label="social media icon">🌐</span> {/* Placeholder icon */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {renderLinksInDropdown('Social Media')}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Assistant Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600">
                  <span role="img" aria-label="ai assistant icon">🤖</span> {/* Placeholder icon */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {renderLinksInDropdown('AI Assistant')}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Entertainment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600">
                  <span role="img" aria-label="entertainment icon">🎬</span> {/* Placeholder icon */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {renderLinksInDropdown('Entertainment')}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallpaper Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600">
                  <span role="img" aria-label="wallpaper icon">🖼️</span> {/* Placeholder icon */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-4 w-64">
                <DropdownMenuLabel>Set Wallpaper</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* WallpaperSetter component directly inside DropdownMenuContent */}
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={newWallpaperInput}
                    onChange={(e) => setNewWallpaperInput(e.target.value)}
                    className="p-2 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                  <Button
                    onClick={handleSaveWallpaper}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Apply
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>

        {/* Main Content Area: Profile Picture, Clock, and Search Bar */}
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-8 p-6 md:p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700
                        dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">

          {/* Profile Picture and Clock in a row */}
          <div className="flex items-center w-full justify-center space-x-4"> {/* Added justify-center for centering */}
            {/* Profile Picture (moved here) */}
            <div className="flex-shrink-0">
              <img
                src={session.user?.image || mockUser.profilePictureUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg object-cover"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/A0CED9/000000?text=JD'; }}
              />
            </div>

            {/* Clock and Date */}
            <Clock />
          </div>

          {/* Search Bar (below profile picture and clock) */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>
    );
  }

  return null; // Should not reach here if redirection works correctly
};

export default DashboardPage;

// Clock Component (remains the same)
const Clock: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateClock(); // Set initial time immediately
    const intervalId = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="text-center text-white space-y-2">
      <p className="text-6xl font-extrabold text-shadow-lg drop-shadow-md">{time}</p>
      <p className="text-xl font-medium text-shadow-md">{date}</p>
    </div>
  );
};
