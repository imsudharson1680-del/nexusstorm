import React from 'react';
import { ActiveSection } from '../types';
import { 
  LayoutDashboard, 
  CloudLightning, 
  Building2, 
  GitFork, 
  Flame, 
  ListOrdered, 
  Sparkles, 
  Database, 
  Layers 
} from 'lucide-react';

interface NavigationProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  cascadeActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSelectSection,
  cascadeActive
}) => {
  const navItems: { id: ActiveSection; label: string; number: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'command-center', label: 'Command Center', number: '01', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'storm-intelligence', label: 'Storm Intelligence', number: '02', icon: <CloudLightning className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure', number: '03', icon: <Building2 className="w-4 h-4" /> },
    { id: 'network-graph', label: 'Network Graph', number: '04', icon: <GitFork className="w-4 h-4" /> },
    { 
      id: 'cascade-lab', 
      label: 'Cascade Lab', 
      number: '05', 
      icon: <Flame className="w-4 h-4" />, 
      badge: cascadeActive ? 'ALERT' : 'HERO' 
    },
    { id: 'priority-actions', label: 'Priority Actions', number: '06', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'ai-explanation', label: 'AI Explanation', number: '07', icon: <Sparkles className="w-4 h-4 text-[#38BDF8]" /> },
    { id: 'data-models', label: 'Data & Models', number: '08', icon: <Database className="w-4 h-4" /> },
    { id: 'system-architecture', label: 'Architecture', number: '09', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#0B1220] border-b border-[#1E3A5F] px-4 overflow-x-auto scrollbar-thin">
      <div className="max-w-[1920px] mx-auto flex items-center gap-1 py-1 min-w-max">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium tracking-tight transition-all relative ${
                isActive
                  ? 'bg-[#152238] text-[#38BDF8] border border-[#38BDF8]/40 shadow-glow-sky'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A2B] border border-transparent'
              }`}
            >
              <span className="font-mono text-[10px] text-[#94A3B8]/70">{item.number}</span>
              <span className={isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}>{item.icon}</span>
              <span className="font-sans font-semibold">{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  item.badge === 'ALERT'
                    ? 'bg-[#EF4444] text-white animate-pulse'
                    : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#38BDF8] rounded-full shadow-glow-sky"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
