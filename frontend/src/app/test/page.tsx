"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const RandomAvatarGenerator: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    
    setAvatarUrl(`https://api.dicebear.com/9.x/micah/svg?seed=${seed}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button 
        onClick={generateRandomAvatar}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Random Avatar
      </Button>
      {avatarUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Generated Avatar URL:</p>
          {avatarUrl}
          {/* <img src={avatarUrl} alt="Random Avatar" className="w-32 h-32 mt-4 rounded-full shadow-lg" /> */}
        </div>
      )}
    </div>
  );
};

export default RandomAvatarGenerator;