import React, { useState } from 'react';
import { SlidersHorizontal, ArrowRight, Sparkles, CheckCircle2, TrendingUp, X, RotateCcw } from 'lucide-react';
import { SignalInputs, ScoringResult } from '../types';
import { calculateTrustScore } from '../utils/scoringEngine';

interface WhatIfSimulatorProps {
  initialInputs: SignalInputs;
  baseResult: ScoringResult;
  onClose: () => void;
  onApplyChanges: (simulatedInputs: SignalInputs) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialInputs,
  baseResult,
  onClose,
  onApplyChanges
}) => {
  const [simInputs, setSimInputs] = useState<SignalInputs>({ ...initialInputs });

  const simResult = calculateTrustScore(simInputs, baseResult.requestedLoanAmount);
  const scoreDelta = simResult.trustScore - baseResult.trustScore;
  const loanDelta = simResult.sanctionedLoanAmount - baseResult.sanctionedLoanAmount;
  const rateDelta = Number((simResult.recommendedInterestRate - baseResult.recommendedInterestRate).toFixed(2));

  const handleUpdate = <K extends keyof SignalInputs>(key: K, val: SignalInputs[K]) => {
    setSimInputs(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleReset = () => {
    setSimInputs({ ...initialInputs });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                What-If TrustScore Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate how positive financial behavior unlocks higher credit limits & lower interest rates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Delta Scoreboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* TrustScore Change */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Simulated TrustScore:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-black text-3xl text-white font-mono">
                {simResult.trustScore}
              </span>
              <span className={`text-xs font-bold font-mono ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Base: {baseResult.trustScore}</span>
          </div>

          {/* Sanctioned Limit Change */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Max Sanction Limit:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-black text-2xl text-emerald-400 font-mono">
                ₹{simResult.sanctionedLoanAmount.toLocaleString('en-IN')}
              </span>
              {loanDelta !== 0 && (
                <span className={`text-xs font-bold font-mono ${loanDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {loanDelta > 0 ? `+₹${loanDelta.toLocaleString('en-IN')}` : `-₹${Math.abs(loanDelta).toLocaleString('en-IN')}`}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Base: ₹{baseResult.sanctionedLoanAmount.toLocaleString('en-IN')}</span>
          </div>

          {/* Interest Rate Change */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Interest Rate:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-black text-2xl text-teal-300 font-mono">
                {simResult.recommendedInterestRate}%
              </span>
              {rateDelta !== 0 && (
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {rateDelta < 0 ? `${rateDelta}%` : `+${rateDelta}%`}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Base: {baseResult.recommendedInterestRate}% p.a.</span>
          </div>

        </div>

        {/* Interactive Simulation Sliders */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
            Adjust Key Behavioral Levers
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Lever 1: Electricity Bills On Time */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Electricity Bills On-Time:</span>
                <span className="font-mono text-amber-400 font-bold">{simInputs.electricityOnTimeMonths} / 12 Months</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={simInputs.electricityOnTimeMonths}
                onChange={(e) => handleUpdate('electricityOnTimeMonths', Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">12 consecutive on-time bills signals reliable habit.</div>
            </div>

            {/* Lever 2: Rent Payment Streak */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Rent Regularity Streak:</span>
                <span className="font-mono text-cyan-400 font-bold">{simInputs.rentOnTimeStreakMonths} Months</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                value={simInputs.rentOnTimeStreakMonths}
                onChange={(e) => handleUpdate('rentOnTimeStreakMonths', Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">Longer rent streaks provide direct proof of debt-service capacity.</div>
            </div>

            {/* Lever 3: UPI Monthly Txn Count */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly UPI Txn Count:</span>
                <span className="font-mono text-emerald-400 font-bold">{simInputs.upiMonthlyCount} Transactions</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={simInputs.upiMonthlyCount}
                onChange={(e) => handleUpdate('upiMonthlyCount', Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">Demonstrates vibrant daily cash velocity in formal channels.</div>
            </div>

            {/* Lever 4: Link High-CIBIL Guarantor */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Link Smart Guarantor:</span>
                <button
                  type="button"
                  onClick={() => handleUpdate('hasGuarantor', !simInputs.hasGuarantor)}
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    simInputs.hasGuarantor ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {simInputs.hasGuarantor ? 'Active (780 CIBIL)' : 'Disabled'}
                </button>
              </div>
              {simInputs.hasGuarantor ? (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Guarantor Bureau Score:</span>
                    <span className="font-mono text-emerald-400 font-bold">{simInputs.guarantorCibilScore}</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="850"
                    value={simInputs.guarantorCibilScore || 750}
                    onChange={(e) => handleUpdate('guarantorCibilScore', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 pt-1">
                  Enabling a verified guarantor adds up to +55 points instantly.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Current</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyChanges(simInputs);
                onClose();
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Apply Simulated Changes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
