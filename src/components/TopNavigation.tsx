import React from 'react';
import { Compass, Sparkles, Tag, Users, Award, Store, UtensilsCrossed } from 'lucide-react';

interface TopNavigationProps {
  activeTab: 'discover' | 'decision-solver' | 'promotions' | 'community' | 'loyalty';
  setActiveTab: (tab: 'discover' | 'decision-solver' | 'promotions' | 'community' | 'loyalty') => void;
  portalMode: 'diner' | 'merchant';
  setPortalMode: (mode: 'diner' | 'merchant') => void;
  userPoints: number;
  openLoyalty: () => void;
  openDecisionSolver: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  portalMode,
  setPortalMode,
  userPoints,
  openLoyalty,
  openDecisionSolver,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setPortalMode('diner');
                setActiveTab('discover');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-amber-400 transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900 font-display">
                  BiteMatch
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-stone-600 font-medium tracking-wide">
                  {portalMode === 'merchant' ? 'Partner Portal' : 'Nearby Discovery'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          {portalMode === 'diner' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
              <button
                onClick={() => setActiveTab('discover')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  activeTab === 'discover'
                    ? 'border-amber-600 text-stone-900 font-semibold'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Discover Local
              </button>
              <button
                onClick={openDecisionSolver}
                className="flex items-center gap-1.5 whitespace-nowrap shrink-0 text-amber-700 hover:text-amber-800 transition-colors font-semibold py-1"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                10s Decision Solver
              </button>
              <button
                onClick={() => setActiveTab('promotions')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  activeTab === 'promotions'
                    ? 'border-amber-600 text-stone-900 font-semibold'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Seasonal Offers
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  activeTab === 'community'
                    ? 'border-amber-600 text-stone-900 font-semibold'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Community Tips
              </button>
              <button
                onClick={openLoyalty}
                className="flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors py-1 text-stone-700 font-medium"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Rewards</span>
                <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  {userPoints} pts
                </span>
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-6 text-sm text-stone-600">
              <span className="font-medium text-stone-900">
                Restaurant Merchant & Promotions Console
              </span>
              <span className="text-xs text-stone-600">·</span>
              <span className="text-xs text-stone-600">
                Manage Live Menu, Seasonal Offers & Customer Discovery
              </span>
            </div>
          )}

          {/* Zone 3: Primary Action / Mode Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {portalMode === 'diner' ? (
              <button
                onClick={() => setPortalMode('merchant')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200 whitespace-nowrap shrink-0 cursor-pointer"
                title="Switch to Restaurant Merchant Console"
              >
                <Store className="w-4 h-4 text-stone-700" />
                <span>Restaurant Portal</span>
              </button>
            ) : (
              <button
                onClick={() => setPortalMode('diner')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
                title="Return to Diner Discovery"
              >
                <Compass className="w-4 h-4 text-amber-800" />
                <span>Back to Diner View</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50/80 px-2 py-2 text-xs">
        {portalMode === 'diner' ? (
          <>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center gap-1 py-1 px-2 ${
                activeTab === 'discover' ? 'text-amber-700 font-semibold' : 'text-stone-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
            <button
              onClick={openDecisionSolver}
              className="flex flex-col items-center gap-1 py-1 px-2 text-amber-700 font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>10s Match</span>
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`flex flex-col items-center gap-1 py-1 px-2 ${
                activeTab === 'promotions' ? 'text-amber-700 font-semibold' : 'text-stone-600'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Offers</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex flex-col items-center gap-1 py-1 px-2 ${
                activeTab === 'community' ? 'text-amber-700 font-semibold' : 'text-stone-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Tips</span>
            </button>
            <button
              onClick={openLoyalty}
              className="flex flex-col items-center gap-1 py-1 px-2 text-stone-700"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Rewards</span>
            </button>
          </>
        ) : (
          <span className="text-xs text-stone-600 font-medium py-1">
            Restaurant Merchant Dashboard Mode Active
          </span>
        )}
      </div>
    </header>
  );
};
