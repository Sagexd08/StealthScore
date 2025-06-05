import React from 'react';
import { ClerkProvider as ClerkProviderBase } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  return (
    <ClerkProviderBase publishableKey={clerkPubKey}>
      {children}
    </ClerkProviderBase>
  );
};

export default ClerkProvider;
