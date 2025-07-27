import React from 'react';

interface Link {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
}

interface LinkGroup {
  id: string;
  name: string;
  isDefault: boolean;
  displayOrder: number;
  links: Link[];
}

interface LinkGroupsDisplayProps {
  linkGroups: LinkGroup[];
}

const LinkGroupsDisplay: React.FC<LinkGroupsDisplayProps> = ({ linkGroups }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      {linkGroups.map((group) => (
        <div key={group.id} className="bg-gray-800 bg-opacity-70 p-5 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">{group.name}</h2>
          <div className="grid grid-cols-2 gap-3">
            {group.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-gray-700 bg-opacity-70 rounded-lg text-white hover:bg-blue-600 hover:bg-opacity-80 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {link.iconUrl && (
                  <img
                    src={link.iconUrl}
                    alt={`${link.name} icon`}
                    className="w-8 h-8 mb-2 filter invert" // Tailwind filter to make SVG icons white
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide if icon fails to load
                  />
                )}
                <span className="text-sm font-medium text-center">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkGroupsDisplay;
