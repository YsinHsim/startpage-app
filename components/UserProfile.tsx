import React from 'react';

interface UserProfileProps {
  username: string;
  email: string;
  profilePictureUrl: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, email, profilePictureUrl }) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <img
        src={profilePictureUrl}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg object-cover"
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/A0CED9/000000?text=JD'; }} // Fallback image
      />
      <h1 className="text-3xl font-bold text-white text-shadow-lg drop-shadow-md">
        Welcome, {username}!
      </h1>
      <p className="text-gray-200 text-shadow-md">{email}</p>
    </div>
  );
};

export default UserProfile;
