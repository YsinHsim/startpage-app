import React from 'react';
// Import the SearchBar component, which now contains the profile, clock, and search input
import SearchBar from '@/components/SearchBar';

// Define UserData type for userProfile prop
interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentWallpaperUrl?: string | null;
  selectedSearchEngineId?: string | null;
}

interface DashboardMainViewProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  userProfile: UserData; // Prop for user profile data, passed down to SearchBar
}

const DashboardMainView: React.FC<DashboardMainViewProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  userProfile,
}) => {
  return (
    // The SearchBar component now encapsulates the entire central card content
    <SearchBar
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      onSearch={onSearch}
      userProfile={userProfile}
    />
  );
};

export default DashboardMainView;
