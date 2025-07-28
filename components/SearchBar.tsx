import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useSession } from 'next-auth/react'; // Import useSession to get profile data

// Mock User Data (as fallback, real data comes from session)
const mockUser = {
  id: 'user-123',
  username: 'JohnDoe',
  email: 'john.doe@example.com',
  profilePictureUrl: 'https://placehold.co/100x100/A0CED9/000000?text=JD', // Placeholder image
};

// Define UserData type for userProfile prop
interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentWallpaperUrl?: string | null;
  selectedSearchEngineId?: string | null;
}

interface SearchBarProps { // Renamed interface
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  userProfile: UserData; // Prop for user profile data
}

const SearchBar: React.FC<SearchBarProps> = ({ // Renamed component
  searchQuery,
  onSearchQueryChange,
  onSearch,
  userProfile, // Destructure userProfile prop
}) => {
  // Clock Component logic (moved here)
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
    <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-8 p-6 md:p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 dark:bg-gray-800 dark:bg-opacity-60 dark:border-gray-600">
      {/* Profile Picture, Time, and Date in a row */}
      <div className="flex items-center w-full justify-center space-x-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={userProfile?.image || mockUser.profilePictureUrl} // Use userProfile.image
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg object-cover"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/A0CED9/000000?text=JD'; }}
          />
        </div>

        {/* Time and Date */}
        <div className="text-center text-white space-y-2">
          <p className="text-6xl font-extrabold text-shadow-lg drop-shadow-md">{time}</p>
          <p className="text-xl font-medium text-shadow-md">{date}</p>
        </div>
      </div>

      {/* Search Bar (below profile picture and clock) */}
      <form onSubmit={onSearch} className="flex w-full items-center space-x-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="flex-grow p-3 rounded-lg bg-gray-700 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-md
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out
                     dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-900"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar; // Renamed export
