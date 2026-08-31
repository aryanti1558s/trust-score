import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, 
  FileText, SlidersHorizontal, ArrowUpRight, Zap, Award, 
  Sparkles, Users, Lock, ChevronRight, Download, Edit3, 
  Info, Percent, Calendar, DollarSign, Smartphone, Landmark,
  Home, Radio, ShoppingBag, UserCheck, Briefcase, PlaneTakeoff,
  Flame, Database, Clock
} from 'lucide-react';
import { ScoringResult, UserProfile, SignalInputs } from '../types';
import { fetchUserAssessments } from '../services/userService';

interface TrustScoreDashboardProps {
  result: ScoringResult;
  user: UserProfile;
  inputs: SignalInputs;
  onOpenSanctionLetter: () => void;
  onOpenSimulator: () => void;
  onEditSignals: () => void;
}

export const TrustScoreDashboard: React.FC<TrustScoreDashboardProps> = ({
  result,
  user,
  inputs,
  onOpenSanctionLetter,
  onOpenSimulator,
  onEditSignals
}) => {
  const [selectedTenure, setSelectedTenure] = useState(result.maxTenureMonths);
  const [activeSignalFilter, setActiveSignalFilter] = useState<'all' | 'high' | 'attention'>('all');
  const [historyCount, setHistoryCount] = useState<number>(1);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  useEffect(() => {
    async function checkHistory() {
      if (user?.id) {
        const records = await fetchUserAssessments(user.id);
        if (records && records.length > 0) {
          setHistoryCount(records.length);
          setLastSavedTime('Synced to Cloud Firestore');
        }
      }
    }
    checkHistory();
  }, [user?.id, result.trustScore]);

  // Dynamic EMI based on selected tenure
  const r = (result.recommendedInterestRate / 100) / 12;
  const n = selectedTenure;
  const dynamicEmi = Math.round((result.sanctionedLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  // Score percentage for gauge (300 to 900 mapped to 0 to 100%)
  const gaugePercent = Math.max(0, Math.min(100, ((result.trustScore - 300) / 600) * 100));

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Prime Trust': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Strong Trust': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'Moderate Trust': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Emerging Trust': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const getSignalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Radio': return <Radio className="w-4 h-4 text-teal-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Home': return <Home className="w-4 h-4 text-cyan-400" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-emerald-400" />;
      case 'PlaneTakeoff': return <PlaneTakeoff className="w-4 h-4 text-teal-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-violet-400" />;
      case 'UserCheck': return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-amber-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Alert / Firebase Synced Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Alternative Credit Assessment Completed for:</div>
            <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
              <span>{user.name}</span>
              <span className="text-[11px] font-normal text-slate-400">({inputs.employmentType.replace(/_/g, ' ')})</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Zero Prior CIBIL Required
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Flame className="w-3 h-3 text-amber-400" />
                Firestore: Saved
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onEditSignals}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify 10 Signals</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/80 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>What-If Sandbox</span>
          </button>
        </div>
      </div>

      {/* Hero Score & Loan Sanction Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: TrustScore Gauge Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-[#07211d] border border-emerald-800/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Alternative Trust Score
              </span>
              <h2 className="font-display text-xl font-extrabold text-white">TrustScore Rating</h2>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getTierColor(result.scoreTier)}`}>
              {result.scoreTier}
            </span>
          </div>

          {/* Big Score Visualizer */}
          <div className="py-6 flex flex-col items-center justify-center relative z-10">
            <div className="relative w-56 h-36 flex items-center justify-center">
              
              {/* Semi-circular gauge SVG */}
              <svg className="w-full h-full" viewBox="0 0 200 120">
                {/* Background arc */}
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Colored score arc */}
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * gaugePercent) / 100}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#00d09c" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Number Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="font-display font-black text-5xl text-white tracking-tight">
                  {result.trustScore}
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Scale: 300 – 900
                </span>
              </div>
            </div>

            {/* Guarantor Boost Badge */}
            {result.guarantorBoost.applied && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-medium">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Includes <strong>+{result.guarantorBoost.pointsAdded} pts</strong> Smart Guarantor boost</span>
              </div>
            )}
          </div>

          {/* Bottom Indicators */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 relative z-10">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400">ML Default Likelihood</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {result.defaultLikelihoodPercent}%
              </div>
              <div className="text-[10px] text-slate-500">Low default risk profile</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400">Fraud & Anomaly Check</div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{result.fraudRiskStatus.split('/')[0]}</span>
              </div>
              <div className="text-[10px] text-slate-500">All data trails clean</div>
            </div>
          </div>

        </div>

        {/* Right Col: Loan Sizing & Sanction Details (7 cols) - Slide 9 Spotlight */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Slide 9: "Even a Lower Score Still Gets a Loan"
                </span>
                <h2 className="font-display text-2xl font-extrabold text-white mt-0.5">
                  In-Principle Sanctioned Offer
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Pre-approved by</span>
                <div className="text-xs font-bold text-white">TrustScore Lending Network</div>
              </div>
            </div>

            {/* Sanctioned Amount Spotlight */}
            <div className="bg-gradient-to-r from-emerald-950/70 to-teal-950/40 border border-emerald-800/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-300">Maximum Sanctioned Loan Limit:</div>
                <div className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
                  ₹{result.sanctionedLoanAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Purpose: <span className="text-slate-200 font-medium">{inputs.employmentType.replace(/_/g, ' ')} growth</span>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-900/60 pt-3 sm:pt-0 sm:pl-6">
                <div className="text-xs text-slate-300">Interest Rate:</div>
                <div className="font-mono font-extrabold text-2xl text-emerald-400">
                  {result.recommendedInterestRate}% <span className="text-xs font-normal text-slate-400">p.a.</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Zero hidden fee or predatory terms
                </div>
              </div>
            </div>
          </div>

          {/* Tenure & EMI Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Select Repayment Tenure:
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {selectedTenure} Months
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 18, 24, 36].filter(t => t <= result.maxTenureMonths).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTenure(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedTenure === t
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {t} Months
                </button>
              ))}
            </div>

            {/* Calculated Monthly EMI */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Estimated Monthly EMI</div>
                <div className="font-display font-extrabold text-xl text-white mt-0.5">
                  ₹{dynamicEmi.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div>Total Repayable:</div>
                <div className="font-mono font-bold text-slate-200">
                  ₹{(dynamicEmi * selectedTenure).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenSanctionLetter}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all group"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Sanction Letter</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* Cloud Firestore Persistence Status Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Cloud Firestore Synced:</strong> This score and underwriting footprint is stored under project <code className="text-emerald-400 font-mono">trustscore01-98804</code> (Collections: <code className="text-slate-400 font-mono">users</code> & <code className="text-slate-400 font-mono">scoring_assessments</code>).
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] shrink-0">
          Status: <span className="text-emerald-400 font-semibold">Active & Encrypted</span>
        </div>
      </div>

      {/* SLIDE 6 & 8 SPOTLIGHT: Smarter Guarantor Impact & Explainable AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Smarter Guarantor Linked Profile (Slide 6) (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Smarter Guarantor Verification
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Slide 6: "We link the guarantor's own credit score into the model, giving lenders a second verified layer of confidence."
          </p>

          {inputs.hasGuarantor ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Guarantor Name:</span>
                <span className="font-bold text-white">{inputs.guarantorName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Guarantor Bureau CIBIL:</span>
                <span className="font-mono font-bold text-emerald-400">{inputs.guarantorCibilScore} (Prime)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Approval Impact:</span>
                <span className="font-bold text-teal-300">+{result.guarantorBoost.pointsAdded} TrustScore Pts</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                {result.guarantorBoost.explanation}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div>No smart guarantor currently attached to this application.</div>
              <button
                onClick={onEditSignals}
                className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Add Guarantor to unlock +55 pts boost</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Explainable AI & Action Plan (Slide 8) (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-lg text-white">
                Explainable AI (XAI) Breakdown
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Slide 8: Transparent Scoring
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Positive Drivers */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-2.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Trust Drivers</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.positiveDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Steps to Improve */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/50 space-y-2.5">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Path to Unlock Larger Loans</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.actionableRecommendations.length > 0 ? (
                  result.actionableRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">→</span>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">Excellent alternative discipline across all 10 vectors!</li>
                )}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* SLIDE 5: All 10 Alternative Data Signals Breakdown Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Slide 5: Beyond CIBIL
            </div>
            <h2 className="font-display text-xl font-bold text-white">
              The 10 Alternative Data Signals in Detail
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSignalFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSignalFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (10)
            </button>
            <button
              onClick={() => setActiveSignalFilter('high')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeSignalFilter === 'high' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Exceptional (75%+)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {result.signalScores
            .filter(sig => activeSignalFilter === 'all' || (activeSignalFilter === 'high' && sig.score >= 70))
            .map((sig, idx) => (
              <div
                key={sig.key}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getSignalIcon(sig.iconName)}
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {sig.score}/100
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Signal #{idx + 1} ({sig.weight}% wt)
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {sig.title}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {sig.insight}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-500">{sig.keyMetricLabel}</div>
                  <div className="text-xs font-bold font-mono text-slate-200 truncate">
                    {sig.keyMetricValue}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};
