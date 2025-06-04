import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { Home, BarChart3, Shield, Settings, HelpCircle, Download } from 'lucide-react'
import Dock, { type DockItemData } from './Dock'

interface NavigationProps {
  currentView: 'landing' | 'analyzer' | 'results' | 'security' | 'settings' | 'export'
  onNavigate: (view: 'landing' | 'analyzer' | 'results' | 'security' | 'settings' | 'export') => void
  onExport?: () => void
  onHelp?: () => void
  onSettings?: () => void
  onSecurity?: () => void
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  onExport,
  onHelp,
  onSettings,
  onSecurity,
}) => {
  const dockItems: DockItemData[] = [
    {
      icon: <Home className="w-6 h-6" />,
      label: "Home",
      onClick: () => onNavigate('landing'),
      className: currentView === 'landing' ? 'bg-blue-500/30' : '',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: "Analyzer",
      onClick: () => onNavigate('analyzer'),
      className: currentView === 'analyzer' ? 'bg-blue-500/30' : '',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: "Security",
      onClick: () => onSecurity?.(),
      className: currentView === 'security' ? 'bg-blue-500/30' : '',
    },
    {
      icon: <Download className="w-6 h-6" />,
      label: "Export",
      onClick: () => onExport?.(),
      className: currentView === 'export' ? 'bg-blue-500/30' : '',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: "Settings",
      onClick: () => onSettings?.(),
      className: currentView === 'settings' ? 'bg-blue-500/30' : '',
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      label: "Help",
      onClick: () => onHelp?.(),
    },
    {
      icon: (
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "glass-card border border-white/20",
                userButtonPopoverActionButton: "hover:bg-white/10",
              }
            }}
          />
        </div>
      ),
      label: "Profile",
      onClick: () => {
        // UserButton handles its own click
      },
    },
  ]

  return (
    <Dock
      items={dockItems}
      className="backdrop-blur-xl"
      magnification={80}
      distance={150}
      panelHeight={70}
      baseItemSize={55}
      spring={{ mass: 0.1, stiffness: 200, damping: 15 }}
    />
  )
}

export default Navigation
