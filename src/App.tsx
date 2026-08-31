/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * TrustScore - AI-Powered Alternative Credit Scoring for First-Time Borrowers
 * Based on Problem Statement 1 by Ayush & Vishakha
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, SignalInputs, DemoProfile, ScoringResult } from './types';
import { DEMO_PROFILES, INITIAL_INPUTS } from './data/profiles';
import { calculateTrustScore } from './utils/scoringEngine';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { DataSignalsForm } from './components/DataSignalsForm';
import { TrustScoreDashboard } from './components/TrustScoreDashboard';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ProblemStatementModal } from './components/ProblemStatementModal';
import { SanctionLetterModal } from './components/SanctionLetterModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string>(DEMO_PROFILES[0].id);
  const [inputs, setInputs] = useState<SignalInputs>(INITIAL_INPUTS);
  const [requestedLoan, setRequestedLoan] = useState<number>(DEMO_PROFILES[0].requestedLoan);
  const [loanPurpose, setLoanPurpose] = useState<string>(DEMO_PROFILES[0].loanPurpose);
  const [activeView, setActiveView] = useState<'inputs' | 'dashboard'>('inputs');

  // Modals
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isSanctionLetterOpen, setIsSanctionLetterOpen] = useState<boolean>(false);

  // Compute scoring result
  const scoringResult: ScoringResult = calculateTrustScore(inputs, requestedLoan);

  const handleLogin = (newUser: UserProfile, selectedProfile?: DemoProfile) => {
    setUser(newUser);
    if (selectedProfile) {
      setCurrentProfileId(selectedProfile.id);
      setInputs(selectedProfile.inputs);
      setRequestedLoan(selectedProfile.requestedLoan);
      setLoanPurpose(selectedProfile.loanPurpose);
    }
  };

  const handleSelectProfile = (profile: DemoProfile) => {
    setCurrentProfileId(profile.id);
    setInputs(profile.inputs);
    setRequestedLoan(profile.requestedLoan);
    setLoanPurpose(profile.loanPurpose);
    if (user) {
      setUser({
        ...user,
        name: profile.name,
        city: profile.location,
        occupation: profile.roleDescription
      });
    }
  };

  const handleCalculateScore = () => {
    setActiveView('dashboard');
    // Launch celebratory confetti if score is strong
    if (scoringResult.trustScore >= 640) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d09c', '#10b981', '#34d399', '#38bdf8', '#fbbf24']
        });
      } catch (err) {
        // Ignore in environments without canvas
      }
    }
  };

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setRequestedLoan(50000);
    setLoanPurpose('Working Capital / Equipment');
    setActiveView('inputs');
  };

  // If user is not logged in, render the login page as requested
  if (!user) {
    return (
      <>
        <AuthScreen
          onLogin={handleLogin}
          onOpenDeck={() => setIsDeckOpen(true)}
        />
        {isDeckOpen && (
          <ProblemStatementModal
            onClose={() => setIsDeckOpen(false)}
            onJumpToSignals={() => {
              setIsDeckOpen(false);
              // Auto-login with default demo profile if user clicks configure
              handleLogin({
                id: DEMO_PROFILES[0].id,
                name: DEMO_PROFILES[0].name,
                phone: '+91 98765 43210',
                email: 'borrower@trustscore.ai',
                role: 'borrower',
                city: DEMO_PROFILES[0].location,
                occupation: DEMO_PROFILES[0].roleDescription
              }, DEMO_PROFILES[0]);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        currentProfileId={currentProfileId}
        onSelectProfile={handleSelectProfile}
        onOpenDeck={() => setIsDeckOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onLogout={() => setUser(null)}
        onReset={handleReset}
        activeView={activeView}
        onToggleView={setActiveView}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeView === 'inputs' ? (
          <DataSignalsForm
            inputs={inputs}
            requestedLoan={requestedLoan}
            loanPurpose={loanPurpose}
            onUpdateInputs={setInputs}
            onUpdateLoan={(amt, purpose) => {
              setRequestedLoan(amt);
              setLoanPurpose(purpose);
            }}
            onCalculateScore={handleCalculateScore}
          />
        ) : (
          <TrustScoreDashboard
            result={scoringResult}
            user={user}
            inputs={inputs}
            onOpenSanctionLetter={() => setIsSanctionLetterOpen(true)}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onEditSignals={() => setActiveView('inputs')}
          />
        )}
      </main>

      {/* Modals */}
      {isDeckOpen && (
        <ProblemStatementModal
          onClose={() => setIsDeckOpen(false)}
          onJumpToSignals={() => {
            setIsDeckOpen(false);
            setActiveView('inputs');
          }}
        />
      )}

      {isSimulatorOpen && (
        <WhatIfSimulator
          initialInputs={inputs}
          baseResult={scoringResult}
          onClose={() => setIsSimulatorOpen(false)}
          onApplyChanges={(newInputs) => {
            setInputs(newInputs);
            setActiveView('dashboard');
          }}
        />
      )}

      {isSanctionLetterOpen && (
        <SanctionLetterModal
          result={scoringResult}
          user={user}
          inputs={inputs}
          onClose={() => setIsSanctionLetterOpen(false)}
        />
      )}

    </div>
  );
}
