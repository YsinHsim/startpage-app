import React from 'react';

interface WallpaperSetterProps {
  newWallpaperInput: string;
  onNewWallpaperInputChange: (value: string) => void;
  onSaveWallpaper: () => void;
}

const WallpaperSetter: React.FC<WallpaperSetterProps> = ({
  newWallpaperInput,
  onNewWallpaperInputChange,
  onSaveWallpaper,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center w-full space-y-3 sm:space-y-0 sm:space-x-3">
      <input
        type="text"
        placeholder="Enter new wallpaper URL"
        value={newWallpaperInput}
        onChange={(e) => onNewWallpaperInputChange(e.target.value)}
        className="flex-grow p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-md"
      />
      <button
        onClick={onSaveWallpaper}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out"
      >
        Set Wallpaper
      </button>
    </div>
  );
};

export default WallpaperSetter;
