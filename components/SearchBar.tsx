import React from 'react';

// Removed SearchEngine interface and related props as selection is now external

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
}) => {
  return (
    <form onSubmit={onSearch} className="flex flex-grow items-center space-x-3"> {/* flex-grow to take available space */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        className="flex-grow p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-md"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
