import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Settings,
  LogOut,
  Edit3,
  Save,
  X,
  Crown,
  Activity,
  Download,
  Upload,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUserAnalytics } from '../hooks/useUserAnalytics';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { analytics, isLoading: analyticsLoading } = useUserAnalytics();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  React.useEffect(() => {
    if (user) {
      setEditedName(user.fullName || '');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      
      if (onNavigate) {
        onNavigate('landing');
      }
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleSaveName = async () => {
    if (!user) return;
    
    try {
      await user.update({
        firstName: editedName.split(' ')[0] || '',
        lastName: editedName.split(' ').slice(1).join(' ') || '',
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleExportData = () => {
    const userData = {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName,
      createdAt: user?.createdAt,
      lastSignIn: user?.lastSignInAt,
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pitchguard-profile-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Profile data exported');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="glass-card p-8">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Not Signed In</h2>
          <p className="text-white/70">Please sign in to view your profile.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>
        <p className="text-white/70 text-lg">
          Manage your PitchGuard account and preferences
        </p>
      </div>

      {}
      <div className="glass-card p-8">
        <div className="flex items-start gap-6">
          {}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                user.fullName?.charAt(0) || user.primaryEmailAddress?.emailAddress?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>

          {}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-1 text-white text-xl font-bold"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">
                    {user.fullName || 'Anonymous User'}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2 text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Last active {new Date(user.lastSignInAt || user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-6 text-center hover:bg-white/10 transition-colors"
        >
          <Settings className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Settings</h3>
          <p className="text-white/60 text-sm">Customize preferences</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card p-6 text-center hover:bg-white/10 transition-colors"
        >
          <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Upgrade</h3>
          <p className="text-white/60 text-sm">Get premium features</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportData}
          className="glass-card p-6 text-center hover:bg-white/10 transition-colors"
        >
          <Download className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Export Data</h3>
          <p className="text-white/60 text-sm">Download your data</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="glass-card p-6 text-center hover:bg-red-500/20 transition-colors group"
        >
          <LogOut className="w-8 h-8 text-red-400 group-hover:text-red-300 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Sign Out</h3>
          <p className="text-white/60 text-sm">End your session</p>
        </motion.button>
      </div>

      {}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">0</div>
            <div className="text-white/70">Pitches Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">0</div>
            <div className="text-white/70">Reports Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">0</div>
            <div className="text-white/70">Privacy Score</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
