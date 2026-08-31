import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download, Award, Building } from 'lucide-react';
import { ScoringResult, UserProfile, SignalInputs } from '../types';

interface SanctionLetterModalProps {
  result: ScoringResult;
  user: UserProfile;
  inputs: SignalInputs;
  onClose: () => void;
}

export const SanctionLetterModal: React.FC<SanctionLetterModalProps> = ({
  result,
  user,
  inputs,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const sanctionId = 'TS-INP-' + Math.floor(100000 + Math.random() * 900000);
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Award className="w-5 h-5" />
            <span>Digital Pre-Approved Loan Sanction Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sanction Letter Paper (White / High Contrast) */}
        <div 
          id="printable-sanction-letter"
          className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-lg space-y-6 border border-slate-200"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">TrustScore AI</h1>
                <p className="text-xs text-slate-600">Alternative Credit Underwriting & Partner Bank Consortium</p>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600">
              <div><strong className="text-slate-900">Certificate ID:</strong> {sanctionId}</div>
              <div><strong className="text-slate-900">Date of Issue:</strong> {issueDate}</div>
              <div><strong className="text-slate-900">Validity:</strong> 45 Days from Issue</div>
            </div>
          </div>

          {/* Title banner */}
          <div className="text-center py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
              Formal In-Principle Sanction Letter (Non-CIBIL Alternative Route)
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Dear <strong className="text-slate-900">{user.name}</strong>,
            </p>
            <p>
              We are pleased to inform you that based on our comprehensive <strong>10-Signal Alternative Trust Assessment</strong> (evaluating your verified UPI transactions, utility discipline, rent consistency, transit footprint, and smart guarantor standing), you have been awarded an <strong>In-Principle Loan Pre-Approval</strong> under our Fair Credit Access Framework (Slide 9).
            </p>
          </div>

          {/* Sanction Term Sheet */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
              Sanctioned Facility Parameters
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Sanctioned Amount:</span>
                <strong className="text-base text-emerald-700 font-mono">₹{result.sanctionedLoanAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Interest Rate:</span>
                <strong className="text-base text-slate-900 font-mono">{result.recommendedInterestRate}% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-500 block">TrustScore Rating:</span>
                <strong className="text-base text-slate-900 font-mono">{result.trustScore} / 900 ({result.scoreTier})</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Max Tenure:</span>
                <strong className="text-base text-slate-900 font-mono">{result.maxTenureMonths} Months</strong>
              </div>
            </div>
          </div>

          {/* Alternative Signals Summary */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">Verified Behavioral Underwriting Trails:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>Rent Discipline:</strong> {inputs.rentOnTimeStreakMonths} Mos On-Time
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>Electricity Timeliness:</strong> {inputs.electricityOnTimeMonths}/12 Cleared
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>UPI Flow:</strong> {inputs.upiMonthlyCount} Txns/mo
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>Identity KYC:</strong> DigiLocker Verified
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>Fraud Check:</strong> {result.fraudRiskStatus}
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                ✓ <strong>Guarantor:</strong> {inputs.hasGuarantor ? 'Linked & Bureau Verified' : 'Standard Self-Credit'}
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div>
              <div className="font-mono text-[10px] text-slate-500 uppercase">Co-Issued Under Problem Statement 1</div>
              <div className="font-serif font-bold text-slate-900">TrustScore AI — Ayush & Vishakha</div>
              <div className="text-[10px] text-slate-500">RBI Regulatory Sandbox Framework Compliant</div>
            </div>

            <div className="text-right">
              <div className="w-32 h-10 border-b border-slate-400 mb-1 flex items-end justify-center">
                <span className="font-serif italic text-emerald-800 text-sm">Ayush & Vishakha</span>
              </div>
              <div className="font-bold text-slate-900">Chief Risk Underwriter</div>
              <div className="text-[10px] text-slate-500">Partner Bank & NBFC Network</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
