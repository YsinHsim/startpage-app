"use client"; // Mark as Client Component as it uses hooks and client-side interactions

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ColorModeToggle"; // Import the theme toggle

// Define types for props
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

interface DashboardNavbarProps {
  mockSearchEngines: SearchEngine[]; // Pass mock or fetched search engines
  selectedSearchEngine: SearchEngine | null;
  setSelectedSearchEngine: (engine: SearchEngine) => void;
  mockLinkGroups: LinkGroup[]; // Pass mock or fetched link groups
  setCurrentView: (view: 'main' | 'wallpaper') => void; // Callback to change main view
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  mockSearchEngines,
  selectedSearchEngine,
  setSelectedSearchEngine,
  mockLinkGroups,
  setCurrentView,
}) => {

  // Helper to render links within a dropdown (copied from dashboard page)
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

  return (
    <div className="absolute top-4 w-full flex justify-between items-center px-4 z-20">
      {/* Top Left: Home Button */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="px-4 py-2 bg-gray-700 bg-opacity-70 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
          &larr; Home
        </Link>
      </div>

      {/* Top Right: Search Engine Dropdown, Link Group Dropdowns, Wallpaper Button, and Theme Toggle */}
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
                {selectedSearchEngine?.id === engine.id && (
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

        {/* Wallpaper Button (now triggers full-page view change) */}
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-700 bg-opacity-70 text-white hover:bg-gray-600"
          onClick={() => setCurrentView('wallpaper')} // Set view to 'wallpaper'
        >
          <span role="img" aria-label="wallpaper icon">🖼️</span> {/* Placeholder icon */}
        </Button>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default DashboardNavbar;
