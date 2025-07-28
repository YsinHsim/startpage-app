"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Import your main content component and new navbar
import DashboardMainView from '@/components/DashboardMainView';
import DashboardNavbar from '@/components/DashboardNavbar';
import WallpaperManagement from '@/components/WallpaperManagement';

// Mock Data for initial states and fallbacks if data fetching fails or is slow
// In a real application, these would ideally be replaced entirely by fetched data.
const initialMockUser = {
  id: 'user-123',
  username: 'Loading User',
  email: 'loading@example.com',
  profilePictureUrl: 'https://placehold.co/100x100/A0CED9/000000?text=JD',
  currentWallpaperUrl: 'https://placehold.co/1920x1080/4A4E69/FFFFFF?text=Your+Wallpaper',
};

const initialMockSearchEngines = [
  { id: 'se-google', name: 'Google', baseUrl: 'https://www.google.com/search?q=', isDefault: true },
];

const initialMockLinkGroups = [
  {
    id: 'lg-loading',
    name: 'Loading Links',
    isDefault: true,
    displayOrder: 1,
    links: [{ id: 'link-loading', name: 'Loading...', url: '#', iconUrl: null }],
  },
];

// Define types for fetched data
interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentWallpaperUrl?: string | null;
  selectedSearchEngineId?: string | null;
}

interface SearchEngine {
  id: string;
  name: string;
  baseUrl: string;
  isDefault: boolean;
}

interface LinkItem {
  id: string;
  name: string;
  url: string;
  iconUrl?: string | null;
}

interface LinkGroup {
  id: string;
  name: string;
  isDefault: boolean;
  displayOrder: number;
  links: LinkItem[];
}

interface WallpaperItem {
  id: string;
  userId: string;
  url: string;
  name?: string | null;
}

// Type for the overall fetched data
interface FetchedDashboardData {
  user: UserData;
  searchEngines: SearchEngine[];
  linkGroups: LinkGroup[];
  wallpapers: WallpaperItem[];
}

type DashboardViewType = 'main' | 'wallpaper';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State to control which main content view is displayed
  const [currentView, setCurrentView] = useState<DashboardViewType>('main');

  // States for fetched data
  const [dashboardData, setDashboardData] = useState<FetchedDashboardData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  // States for dashboard features (derived from fetched data or user interaction)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<SearchEngine | null>(initialMockSearchEngines[0]);
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(initialMockUser.currentWallpaperUrl);
  const [newWallpaperInput, setNewWallpaperInput] = useState<string>('');

  // Function to fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    setErrorData(null);
    try {
      console.log('Attempting to fetch dashboard data from /api/user...');
      const response = await fetch('/api/user');
      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API response not OK:', errorBody);
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText} - ${errorBody}`);
      }
      
      const data: FetchedDashboardData = await response.json();
      console.log('Fetched data:', data);
      setDashboardData(data);

      const resolvedWallpaperUrl = data.user.currentWallpaperUrl || initialMockUser.currentWallpaperUrl;
      setWallpaperUrl(resolvedWallpaperUrl);
      console.log('Wallpaper URL set to:', resolvedWallpaperUrl); // Log the set URL
      
      const initialSearchEngine = data.searchEngines.find(se => se.id === data.user.selectedSearchEngineId) || data.searchEngines[0];
      setSelectedSearchEngine(initialSearchEngine || null);

    } catch (error: any) {
      console.error("Error in fetchDashboardData:", error);
      setErrorData(error.message || 'An unexpected error occurred while fetching data.');
    } finally {
      setLoadingData(false);
    }
  }, [session?.user?.id, status]);

  // Effect to handle authentication redirection and data fetching
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log('User unauthenticated, redirecting to login.');
      router.push('/login');
    } else if (status === "authenticated" && session?.user?.id && !dashboardData && !errorData) {
      console.log('User authenticated, fetching dashboard data.');
      fetchDashboardData();
    }
  }, [status, session, router, dashboardData, errorData, fetchDashboardData]);

  // Function to handle search (passed to DashboardMainView which then passes to SearchBar)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && selectedSearchEngine) {
      const searchUrl = `${selectedSearchEngine.baseUrl}${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, '_blank');
    }
  };

  // Function to save new wallpaper URL to DB and set as current
  const handleSaveWallpaper = async () => {
    if (!session?.user?.id || !newWallpaperInput.trim()) return;

    setLoadingData(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addWallpaper',
          url: newWallpaperInput,
          name: `Custom Wallpaper ${new Date().toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to add new wallpaper: ${response.status} ${response.statusText} - ${errorBody}`);
      }
      
      console.log('Wallpaper added successfully, re-fetching data...');
      await fetchDashboardData();
      setNewWallpaperInput('');
      setCurrentView('main');
    } catch (error: any) {
      console.error('Error saving wallpaper:', error);
      setErrorData('Failed to save wallpaper.');
    } finally {
      setLoadingData(false);
    }
  };

  // Function to select an existing wallpaper from the gallery
  const handleSelectWallpaper = async (wallpaperId: string) => {
    if (!session?.user?.id || !dashboardData) return;

    const selected = dashboardData.wallpapers.find(w => w.id === wallpaperId);
    if (!selected) return;

    setLoadingData(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setCurrentWallpaper',
          wallpaperUrl: selected.url,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to set current wallpaper: ${response.status} ${response.statusText} - ${errorBody}`);
      }
      
      console.log('Current wallpaper set successfully.');
      setWallpaperUrl(selected.url);
      setCurrentView('main');
    } catch (error: any) {
      console.error('Error selecting wallpaper:', error);
      setErrorData('Failed to set wallpaper.');
    } finally {
      setLoadingData(false);
    }
  };

  // Overall loading state for the page
  if (status === "loading" || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white
                      dark:from-gray-900 dark:to-black dark:text-gray-100">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  // Handle error state
  if (errorData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-black text-white">
        <p className="text-xl text-red-300">Error: {errorData}</p>
        <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        <Link href="/" className="text-gray-400 hover:underline mt-4 block">Back to Home</Link>
      </div>
    );
  }

  // Only render dashboard content if authenticated and data is loaded
  if (session && dashboardData) {
    console.log('Rendering dashboard with wallpaperUrl:', wallpaperUrl); // Log at render time
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      >
        {/* Removed the overlay div completely to test background visibility */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}

        {/* Top Bar - always visible */}
        <DashboardNavbar
          mockSearchEngines={dashboardData.searchEngines}
          selectedSearchEngine={selectedSearchEngine}
          setSelectedSearchEngine={setSelectedSearchEngine}
          mockLinkGroups={dashboardData.linkGroups}
          setCurrentView={setCurrentView}
        />

        {/* Conditional Rendering of Main Content Area */}
        {currentView === 'main' ? (
          <DashboardMainView
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            userProfile={dashboardData.user}
          />
        ) : (
          <WallpaperManagement
            wallpaperUrl={wallpaperUrl}
            newWallpaperInput={newWallpaperInput}
            onNewWallpaperInputChange={setNewWallpaperInput}
            onSaveWallpaper={handleSaveWallpaper}
            onBackToDashboard={() => setCurrentView('main')}
            savedWallpapers={dashboardData.wallpapers}
            onSelectWallpaper={handleSelectWallpaper}
          />
        )}
      </div>
    );
  }

  return null;
};

export default DashboardPage;
