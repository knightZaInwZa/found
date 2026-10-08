import React from 'react';
import { PlusCircle, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'report' | 'track' | 'browse' | 'guidelines';
  setActiveTab: (tab: 'report' | 'track' | 'browse' | 'guidelines') => void;
  reportCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, reportCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('report')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-800 transition-colors text-left"
        >
          Lost Item Registry
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('report')}
            className={`transition-colors relative py-1 ${
              activeTab === 'report'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report Lost Item
            {activeTab === 'report' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`transition-colors relative py-1 ${
              activeTab === 'track'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track Status
            {activeTab === 'track' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors relative py-1 flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Recent Registry</span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">({reportCount})</span>
            {activeTab === 'browse' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`transition-colors relative py-1 ${
              activeTab === 'guidelines'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Desk Guidelines
            {activeTab === 'guidelines' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {activeTab !== 'report' ? (
            <button
              onClick={() => setActiveTab('report')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File New Report</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('track')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Track By Reference</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
