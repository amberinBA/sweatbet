'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Initialize Farcaster Frame SDK
        const context = await sdk.context;
        console.log('Farcaster Frame context:', context);

        // Notify frame is ready
        sdk.actions.ready();

        setIsSDKLoaded(true);
      } catch (error) {
        console.error('Error loading Farcaster SDK:', error);
        // Continue anyway for development
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading SweatBet...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
