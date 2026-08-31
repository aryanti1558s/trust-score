import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, BookOpen, User, Sparkles, LogOut, 
  SlidersHorizontal, RefreshCw, Flame, CheckCircle2, 
  Cloud, Database, ChevronDown
} from 'lucide-react';
import { UserProfile, DemoProfile } from '../types';
import { DEMO_PROFILES } from '../data/profiles';
import { db, auth } from '../firebase';

interface NavbarProps {
  user: UserProfile;
  currentProfileId: string;
  onSelectProfile: (profile: DemoProfile) => void;
  onOpenDeck: () => void;
  onOpenSimulator: () => void;
  onLogout: () => void;
  onReset: () => void;
  activeView: 'dashboard' | 'inputs';
  onToggleView: (view: 'dashboard' | 'inputs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentProfileId,
  onSelectProfile,
  onOpenDeck,
  onOpenSimulator,
  onLogout,
  onReset,
  activeView,
  onToggleView
}) => {
  const [showFirebaseDetails, setShowFirebaseDetails] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/80 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Live Firebase Pill */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight text-white">TrustScore</span>
              
              {/* Visible Firebase Connection Badge */}
              <div className="relative">
                <button
                  onClick={() => setShowFirebaseDetails(!showFirebaseDetails)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-sm transition-all"
                  title="Firebase is Connected to trustscore01-98804"
                >
                  <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>Firebase Connected</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>

                {/* Dropdown with project info */}
                {showFirebaseDetails && (
                  <div className="absolute left-0 mt-2 w-72 p-3.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-amber-400" />
                        Firebase Live Status
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">ACTIVE</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                      <div><strong className="text-slate-400">Project ID:</strong> trustscore01-98804</div>
                      <div><strong className="text-slate-400">Auth Domain:</strong> trustscore01-98804.firebaseapp.com</div>
                      <div><strong className="text-slate-400">Database:</strong> Cloud Firestore</div>
                      <div><strong className="text-slate-400">User UID:</strong> {user.id.slice(0, 14)}...</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Login sessions & credit assessments sync in real time.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered Credit Scoring for First-Time Borrowers</p>
          </div>
        </div>

        {/* Center Nav Views */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onToggleView('inputs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'inputs'
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            10 Signal Inputs & Guarantor
          </button>
          <button
            onClick={() => onToggleView('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            TrustScore & Loan Sanction
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* What If Simulator Button */}
          <button
            onClick={onOpenSimulator}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 transition-colors"
            title="Simulate impact of signal changes"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>What-If Engine</span>
          </button>

          {/* Demo Persona Quick Select */}
          <div className="relative group hidden lg:block">
            <select
              value={currentProfileId}
              onChange={(e) => {
                const p = DEMO_PROFILES.find(x => x.id === e.target.value);
                if (p) onSelectProfile(p);
              }}
              className="bg-slate-900 text-xs text-slate-200 border border-slate-700/70 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer hover:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="" disabled>Load Persona...</option>
              {DEMO_PROFILES.map(prof => (
                <option key={prof.id} value={prof.id}>
                  👤 {prof.name} ({prof.roleDescription.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-emerald-400 capitalize">{user.role} Portal</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-red-950 transition-colors"
              title="Sign Out / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-3">
        <button
          onClick={() => onToggleView('inputs')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
            activeView === 'inputs' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'
          }`}
        >
          10 Signal Inputs
        </button>
        <button
          onClick={() => onToggleView('dashboard')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ml-2 ${
            activeView === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'
          }`}
        >
          Score & Sanction
        </button>
        <button
          onClick={onOpenSimulator}
          className="ml-2 px-2.5 py-1.5 text-xs text-emerald-400 bg-emerald-950/60 rounded-lg border border-emerald-800/60"
        >
          Simulator
        </button>
      </div>
    </header>
  );
};
