'use client';

import { SignIn } from '@clerk/nextjs';
import ParticleBackground from '../../../components/ParticleBackground';
import Squares from '../../../components/Squares';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <Squares
        direction="diagonal"
        speed={0.3}
        borderColor="rgba(99, 102, 241, 0.08)"
        squareSize={60}
        hoverFillColor="rgba(99, 102, 241, 0.03)"
      />
      
      <div className="relative z-10">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
              card: 'bg-white/10 backdrop-blur-lg border border-white/20',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/70',
              socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
              formFieldLabel: 'text-white',
              formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-white/50',
              footerActionLink: 'text-indigo-400 hover:text-indigo-300',
            },
          }}
        />
      </div>
    </div>
  );
}
