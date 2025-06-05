import React from 'react';
import { ClerkProvider as ClerkProviderBase } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkProviderProps {
  children: React.ReactNode;
}

const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  // If no Clerk key is provided or it's a placeholder, render children without Clerk
  if (!clerkPubKey || clerkPubKey.includes('your_production_clerk_key_here') || clerkPubKey.includes('pk_live_your_production_clerk_key_here')) {
    console.warn('Clerk authentication is not properly configured. Running in fallback mode.');
    return <>{children}</>;
  }

  try {
    return (
      <ClerkProviderBase publishableKey={clerkPubKey}>
        {children}
      </ClerkProviderBase>
    );
  } catch (error) {
    console.error('Error initializing Clerk:', error);
    // Fallback to rendering without Clerk if there's an error
    return <>{children}</>;
  }
};

export default ClerkProvider;
