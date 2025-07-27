"use client"; // Mark as Client Component as it uses hooks like useState

import React from 'react';
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Input } from "@/components/ui/input"; // Assuming you have shadcn Input component, if not, use regular input

interface WallpaperManagementProps {
  wallpaperUrl: string;
  newWallpaperInput: string;
  onNewWallpaperInputChange: (value: string) => void;
  onSaveWallpaper: () => void;
  onBackToDashboard: () => void; // Callback to switch back to main dashboard view
}

const WallpaperManagement: React.FC<WallpaperManagementProps> = ({
  wallpaperUrl,
  newWallpaperInput,
  onNewWallpaperInputChange,
  onSaveWallpaper,
  onBackToDashboard,
}) => {
  return (
    <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-8 p-6 md:p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700
                    dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">

      <h2 className="text-3xl font-bold text-white mb-4">Manage Wallpapers</h2>

      {/* Current Wallpaper Preview */}
      {wallpaperUrl && (
        <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
          <img
            src={wallpaperUrl}
            alt="Current Wallpaper Preview"
            className="object-cover w-full h-full"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x200/4A4E69/FFFFFF?text=Image+Load+Error'; }}
          />
        </div>
      )}

      {/* Input for new wallpaper URL */}
      <div className="flex flex-col sm:flex-row items-center w-full space-y-3 sm:space-y-0 sm:space-x-3">
        <Input
          type="text"
          placeholder="Enter new wallpaper URL"
          value={newWallpaperInput}
          onChange={(e) => onNewWallpaperInputChange(e.target.value)}
          className="flex-grow p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-md"
        />
        <Button
          onClick={onSaveWallpaper}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out"
        >
          Set Wallpaper
        </Button>
      </div>

      {/* Future: Wallpaper Gallery */}
      <div className="w-full text-center text-gray-400">
        <p>Your saved wallpapers will appear here (future feature).</p>
      </div>

      {/* Back to Dashboard Button */}
      <Button
        onClick={onBackToDashboard}
        variant="secondary" // Use a secondary variant for a less prominent button
        className="mt-6 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 ease-in-out"
      >
        &larr; Back to Dashboard
      </Button>
    </div>
  );
};

export default WallpaperManagement;
