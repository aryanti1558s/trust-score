import React, { useState } from 'react';
import { 
  Smartphone, Radio, Zap, Home, Landmark, 
  PlaneTakeoff, ShoppingBag, ShieldCheck, UserCheck, Briefcase, 
  Users, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Info,
  Check, ChevronRight, Calculator, RefreshCw
} from 'lucide-react';
import { SignalInputs, CommuteMode, PaymentChannel, OccupationType, InflowRegularity, OnTimeStatus } from '../types';

interface DataSignalsFormProps {
  inputs: SignalInputs;
  requestedLoan: number;
  loanPurpose: string;
  onUpdateInputs: (inputs: SignalInputs) => void;
  onUpdateLoan: (amount: number, purpose: string) => void;
  onCalculateScore: () => void;
}

export const DataSignalsForm: React.FC<DataSignalsFormProps> = ({
  inputs,
  requestedLoan,
  loanPurpose,
  onUpdateInputs,
  onUpdateLoan,
  onCalculateScore
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'utilities' | 'financial' | 'identity' | 'guarantor'>('all');

  const handleChange = <K extends keyof SignalInputs>(key: K, value: SignalInputs[K]) => {
    onUpdateInputs({
      ...inputs,
      [key]: value
    });
  };

  const togglePolicyType = (policy: string) => {
    const current = inputs.insurancePolicyTypes;
    if (current.includes(policy)) {
      handleChange('insurancePolicyTypes', current.filter(p => p !== policy));
    } else {
      handleChange('insurancePolicyTypes', [...current, policy]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Alternative Data Ingestion Engine
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              The 10 Key Data Signals Beyond CIBIL
            </h1>
            <p className="text-sm text-slate-300">
              Rent, bills, and everyday cashflow reflect real financial discipline. Configure your verified alternative footprint below.
            </p>
          </div>

          {/* Quick Loan Sizing Goal Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 w-full lg:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Loan Amount Needed:</span>
              <span className="font-mono text-emerald-400 font-bold text-base">
                ₹{requestedLoan.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={requestedLoan}
              onChange={(e) => onUpdateLoan(Number(e.target.value), loanPurpose)}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={loanPurpose}
              onChange={(e) => onUpdateLoan(requestedLoan, e.target.value)}
              placeholder="Loan Purpose (e.g. Electric 2W, Stock)"
              className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 10 Signals & Guarantor (Full Engine)
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'utilities'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1-4: Digital & Utility Bills
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'financial'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            5-8: Cashflow, Transit & Protection
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'identity'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            9-10: Identity & Employment
          </button>
          <button
            onClick={() => setActiveTab('guarantor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'guarantor'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚡ Smarter Guarantor Verification
          </button>
        </div>
      </div>

      {/* Grid of the 10 Signals */}
      <div className="space-y-6">

        {/* SECTION 1: UTILITIES & BILL PAYMENTS */}
        {(activeTab === 'all' || activeTab === 'utilities') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="font-display text-lg font-bold text-white">
                Part 1: Recurring Bills & Digital Velocity
              </h2>
              <span className="text-xs text-slate-400">(Slide 5: High-signal indicators of discipline)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* SIGNAL 1: UPI Transaction History */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Signal 1 (Weight: 15%)</div>
                      <h3 className="font-display font-bold text-base text-white">UPI Transaction History</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    NPCI Account Aggregator
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly UPI Volume (₹)</label>
                    <input
                      type="number"
                      step="1000"
                      value={inputs.upiMonthlyVolume}
                      onChange={(e) => handleChange('upiMonthlyVolume', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Txn Count</label>
                    <input
                      type="number"
                      value={inputs.upiMonthlyCount}
                      onChange={(e) => handleChange('upiMonthlyCount', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Merchant QR Scans vs P2P:</span>
                    <span className="text-emerald-400 font-mono font-semibold">{inputs.upiMerchantRatio}% Merchant</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={inputs.upiMerchantRatio}
                    onChange={(e) => handleChange('upiMerchantRatio', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">Active UPI Autopay Mandates:</span>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleChange('upiAutopayMandates', n)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          inputs.upiAutopayMandates === n
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIGNAL 2: Mobile Recharge Consistency */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Signal 2 (Weight: 8%)</div>
                      <h3 className="font-display font-bold text-base text-white">Mobile Recharge Consistency</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Telecom API
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">On-Time Streak (Months)</label>
                    <input
                      type="number"
                      value={inputs.mobileConsistencyStreakMonths}
                      onChange={(e) => handleChange('mobileConsistencyStreakMonths', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Avg Plan Value (₹)</label>
                    <input
                      type="number"
                      value={inputs.mobileMonthlyPlanCost}
                      onChange={(e) => handleChange('mobileMonthlyPlanCost', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Recharge Punctuality Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['always', 'mostly', 'irregular'] as OnTimeStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleChange('mobileRechargeStatus', status)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                          inputs.mobileRechargeStatus === status
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {status === 'always' ? 'Always on time' : status === 'mostly' ? 'Mostly on time' : 'Irregular'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>Continuous SIM Tenure:</span>
                  <span className="font-mono text-white font-semibold">{inputs.mobileTenureMonths} Months on same number</span>
                </div>
              </div>

              {/* SIGNAL 3: Electricity Bill Payments */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Signal 3 (Weight: 12%)</div>
                      <h3 className="font-display font-bold text-base text-white">Electricity Bill Payments</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    BBPS Integration
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Bills Cleared On-Time (Last 12 Months):</span>
                    <span className="font-mono font-bold text-amber-400">{inputs.electricityOnTimeMonths} / 12 Months</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={inputs.electricityOnTimeMonths}
                    onChange={(e) => handleChange('electricityOnTimeMonths', Number(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Avg Monthly Bill (₹)</label>
                    <input
                      type="number"
                      value={inputs.electricityAvgBill}
                      onChange={(e) => handleChange('electricityAvgBill', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Disconnection Notices</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={inputs.electricityDisconnectionsCount}
                      onChange={(e) => handleChange('electricityDisconnectionsCount', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={inputs.electricityMeterMatch}
                    onChange={(e) => handleChange('electricityMeterMatch', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span>Consumer CA / Meter registered in applicant or immediate family name</span>
                </label>
              </div>

              {/* SIGNAL 4: Rent Payments */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Signal 4 (Weight: 15%)</div>
                      <h3 className="font-display font-bold text-base text-white">Rent Payments</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Highest Reliability
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      step="500"
                      value={inputs.rentMonthlyAmount}
                      onChange={(e) => handleChange('rentMonthlyAmount', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">On-Time Streak (Months)</label>
                    <input
                      type="number"
                      value={inputs.rentOnTimeStreakMonths}
                      onChange={(e) => handleChange('rentOnTimeStreakMonths', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Payment Channel</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(['upi', 'bank_transfer', 'cheque', 'cash_receipt'] as PaymentChannel[]).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleChange('rentPaymentChannel', ch)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium capitalize transition-all ${
                          inputs.rentPaymentChannel === ch
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {ch.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={inputs.rentReceiptsVerified}
                    onChange={(e) => handleChange('rentReceiptsVerified', e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span>Rental Agreement & Landlord UPI ID Verified</span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: CASHFLOW, TRANSIT & PROTECTION */}
        {(activeTab === 'all' || activeTab === 'financial') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <h2 className="font-display text-lg font-bold text-white">
                Part 2: Balance Health, Mobility & Digital Protection
              </h2>
              <span className="text-xs text-slate-400">(Signals 5 to 8: Habitual stability indicators)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* SIGNAL 5: Bank Balance Trends */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Signal 5 (Weight: 12%)</div>
                      <h3 className="font-display font-bold text-base text-white">Bank Balance Trends</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    AA Statement
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Average Monthly Balance (₹)</label>
                    <input
                      type="number"
                      step="1000"
                      value={inputs.bankAvgMonthlyBalance}
                      onChange={(e) => handleChange('bankAvgMonthlyBalance', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Min Balance Penalties (Count)</label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={inputs.bankPenaltyCount}
                      onChange={(e) => handleChange('bankPenaltyCount', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Cash Inflow Regularity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['high', 'medium', 'volatile'] as InflowRegularity[]).map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => handleChange('bankInflowRegularity', reg)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                          inputs.bankInflowRegularity === reg
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Emergency Expense Buffer:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{inputs.bankEmergencyBufferMonths} Months expenses</span>
                </div>
              </div>

              {/* SIGNAL 6: Travel History */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
                      <PlaneTakeoff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Signal 6 (Weight: 6%)</div>
                      <h3 className="font-display font-bold text-base text-white">Travel History & Commute</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Transit Mobility
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Primary Daily Commute Footprint</label>
                  <select
                    value={inputs.travelCommuteMode}
                    onChange={(e) => handleChange('travelCommuteMode', e.target.value as CommuteMode)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="metro_rail_smartcard">Metro / Suburban Train Smart Card</option>
                    <option value="bus_pass">State Bus Smart Pass / Daily Transit</option>
                    <option value="fuel_upi">Two-Wheeler / Fuel Station UPI</option>
                    <option value="ride_hailing">Ola / Uber / Rapido Regular Rider</option>
                    <option value="walking_local">Local Neighborhood / Walking</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Transit Spend (₹)</label>
                    <input
                      type="number"
                      value={inputs.travelMonthlySpend}
                      onChange={(e) => handleChange('travelMonthlySpend', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Interstate Trips/Yr</label>
                    <input
                      type="number"
                      value={inputs.travelInterstateTripsPerYear}
                      onChange={(e) => handleChange('travelInterstateTripsPerYear', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Digital Transit Footprint Index:</span>
                  <span className="font-mono text-teal-400 font-semibold">{inputs.travelDigitalTicketingScore}/100</span>
                </div>
              </div>

              {/* SIGNAL 7: E-commerce Purchase History */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Signal 7 (Weight: 7%)</div>
                      <h3 className="font-display font-bold text-base text-white">E-commerce Purchase History</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Online Footprint
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Orders Count</label>
                    <input
                      type="number"
                      value={inputs.ecommerceMonthlyOrders}
                      onChange={(e) => handleChange('ecommerceMonthlyOrders', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Return / RTO Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.ecommerceReturnRate}
                      onChange={(e) => handleChange('ecommerceReturnRate', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Prepaid Orders vs COD:</span>
                    <span className="font-mono text-indigo-400 font-bold">{inputs.ecommercePrepaidRatio}% Digital Prepaid</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputs.ecommercePrepaidRatio}
                    onChange={(e) => handleChange('ecommercePrepaidRatio', Number(e.target.value))}
                    className="w-full accent-indigo-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span>Shipping Address Consistency:</span>
                  <span className="font-mono text-white font-semibold">{inputs.ecommerceAddressStabilityMonths} Months stable</span>
                </div>
              </div>

              {/* SIGNAL 8: Insurance Payments */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">Signal 8 (Weight: 7%)</div>
                      <h3 className="font-display font-bold text-base text-white">Insurance Payments</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Risk Buffer
                  </span>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.insuranceHasActive}
                    onChange={(e) => handleChange('insuranceHasActive', e.target.checked)}
                    className="w-4 h-4 rounded text-violet-500 accent-violet-500 bg-slate-950 border-slate-700"
                  />
                  <span className="font-semibold text-white">Active Insurance Policy / Micro-Insurance Held</span>
                </label>

                {inputs.insuranceHasActive && (
                  <>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1.5">Policy Categories Covered</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Health', 'Life', 'Crop', 'Vehicle', 'Term'].map((p) => {
                          const isSel = inputs.insurancePolicyTypes.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => togglePolicyType(p)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                isSel
                                  ? 'bg-violet-500 text-slate-950 font-bold'
                                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                              }`}
                            >
                              {isSel ? `✓ ${p}` : `+ ${p}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Annual Premium (₹)</label>
                        <input
                          type="number"
                          value={inputs.insuranceAnnualPremium}
                          onChange={(e) => handleChange('insuranceAnnualPremium', Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Uninterrupted Years</label>
                        <input
                          type="number"
                          value={inputs.insuranceUninterruptedYears}
                          onChange={(e) => handleChange('insuranceUninterruptedYears', Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: IDENTITY & EMPLOYMENT */}
        {(activeTab === 'all' || activeTab === 'identity') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="font-display text-lg font-bold text-white">
                Part 3: Verified Identity & Earning Footprint
              </h2>
              <span className="text-xs text-slate-400">(Signals 9 & 10: Foundational verification trust)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* SIGNAL 9: Aadhaar Verified Identity */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Signal 9 (Weight: 8%)</div>
                      <h3 className="font-display font-bold text-base text-white">Aadhaar Verified Identity</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    DigiLocker
                  </span>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.aadhaarDigiLockerVerified}
                      onChange={(e) => handleChange('aadhaarDigiLockerVerified', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 bg-slate-950 border-slate-700"
                    />
                    <span>DigiLocker Paperless e-KYC Verification Completed</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.aadhaarPanLinked}
                      onChange={(e) => handleChange('aadhaarPanLinked', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 bg-slate-950 border-slate-700"
                    />
                    <span>PAN - Aadhaar Official Linkage Verified on Income Tax Portal</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Address Tenure (Years)</label>
                    <input
                      type="number"
                      value={inputs.aadhaarAddressStabilityYears}
                      onChange={(e) => handleChange('aadhaarAddressStabilityYears', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Biometric Auth</label>
                    <select
                      value={inputs.aadhaarBiometricStatus}
                      onChange={(e) => handleChange('aadhaarBiometricStatus', e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="verified">Verified (UIDAI)</option>
                      <option value="pending">Pending</option>
                      <option value="unlinked">Unlinked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SIGNAL 10: Employment Stability */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Signal 10 (Weight: 10%)</div>
                      <h3 className="font-display font-bold text-base text-white">Employment Stability</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Gig / Merchant API
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Employment Category</label>
                  <select
                    value={inputs.employmentType}
                    onChange={(e) => handleChange('employmentType', e.target.value as OccupationType)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="gig_worker">Quick-Commerce / Delivery Gig Worker</option>
                    <option value="small_merchant">Kirana Store / Retail Merchant</option>
                    <option value="freelancer">Freelancer / Creative Professional</option>
                    <option value="artisan_rural">Rural SHG / Artisan / Tailoring</option>
                    <option value="salaried">Salaried (First Job / Zero CIBIL)</option>
                    <option value="student_fresh_grad">Student / Fresh Graduate</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Monthly Earnings (₹)</label>
                    <input
                      type="number"
                      step="1000"
                      value={inputs.employmentMonthlyIncome}
                      onChange={(e) => handleChange('employmentMonthlyIncome', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tenure in Role (Months)</label>
                    <input
                      type="number"
                      value={inputs.employmentTenureMonths}
                      onChange={(e) => handleChange('employmentTenureMonths', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.employmentTurnoverProofVerified}
                      onChange={(e) => handleChange('employmentTurnoverProofVerified', e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-700"
                    />
                    <span>GST / Platform Payout Statement Verified</span>
                  </label>
                  {inputs.employmentPlatformRating && (
                    <span className="text-xs text-amber-400 font-bold">★ {inputs.employmentPlatformRating}</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 4: SMARTER GUARANTOR VERIFICATION (Slide 6 Spotlight) */}
        {(activeTab === 'all' || activeTab === 'guarantor') && (
          <div className="pt-4">
            <div className="bg-gradient-to-br from-[#0a2f2a] via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                      ⭐ Slide 6 Feature Spotlight
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                      Our Favorite Idea: Smarter Guarantor Verification
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      "Applicant + Guarantor: Two linked trust profiles, one stronger decision."
                    </p>
                  </div>
                </div>

                {/* Guarantor Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-300">Link Smart Guarantor:</span>
                  <button
                    type="button"
                    onClick={() => handleChange('hasGuarantor', !inputs.hasGuarantor)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      inputs.hasGuarantor ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                        inputs.hasGuarantor ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {inputs.hasGuarantor ? (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5">Guarantor Name & Relationship</label>
                      <input
                        type="text"
                        value={inputs.guarantorName}
                        onChange={(e) => handleChange('guarantorName', e.target.value)}
                        placeholder="e.g. Ramesh Verma (Elder Brother)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5">
                        Guarantor CIBIL Score (Linked Signal)
                      </label>
                      <input
                        type="number"
                        min="300"
                        max="900"
                        value={inputs.guarantorCibilScore}
                        onChange={(e) => handleChange('guarantorCibilScore', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400 font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1.5">Guarantor Monthly Income (₹)</label>
                      <input
                        type="number"
                        step="1000"
                        value={inputs.guarantorMonthlyIncome}
                        onChange={(e) => handleChange('guarantorMonthlyIncome', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inputs.guarantorPanVerified}
                        onChange={(e) => handleChange('guarantorPanVerified', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 bg-slate-950 border-slate-700"
                      />
                      <span className="text-xs text-slate-200">
                        Guarantor PAN & Aadhaar cross-verified with Credit Bureau API
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inputs.guarantorConsentGiven}
                        onChange={(e) => handleChange('guarantorConsentGiven', e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 bg-slate-950 border-slate-700"
                      />
                      <span className="text-xs text-slate-200">
                        Digital OTP Consent granted by guarantor for co-underwriting
                      </span>
                    </label>
                  </div>

                  {/* Impact preview */}
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Guarantor link active: Est. <strong className="text-white">+40 to +55 points</strong> TrustScore boost and ~30% higher sanction limit.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    No guarantor attached. The model will evaluate solely on applicant alternative data signals.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChange('hasGuarantor', true)}
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    + Add Guarantor (+50 pts boost)
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-30 bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
            10/10
          </div>
          <div>
            <div className="text-xs font-bold text-white">All 10 Signals & Guarantor Ready</div>
            <div className="text-[11px] text-slate-400">Ready to compute ML TrustScore & Loan Sizing</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onCalculateScore}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Generate Alternative TrustScore & Sanction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
