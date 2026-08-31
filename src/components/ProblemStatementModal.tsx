import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, BookOpen, 
  ShieldCheck, HelpCircle, CheckCircle2, 
  Users, Cpu, Award, TrendingUp, Sparkles, Layers,
  Globe2, Lightbulb
} from 'lucide-react';

interface ProblemStatementModalProps {
  onClose: () => void;
  onJumpToSignals: () => void;
}

export const ProblemStatementModal: React.FC<ProblemStatementModalProps> = ({
  onClose,
  onJumpToSignals
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      number: 1,
      title: 'TrustScore',
      subtitle: 'AI-Powered Alternative Credit Scoring for First-Time Borrowers',
      tag: 'Problem Statement 1',
      author: 'Ayush & Vishakha — Team Submission',
      quote: '"How can a bank trust someone who has never taken a loan before?"',
      type: 'hero'
    },
    {
      number: 2,
      title: 'The Problem',
      tag: 'Market Pain Point',
      quote: '"How can a bank trust someone who has never taken a loan before?"',
      content: 'Traditional credit systems rely almost entirely on CIBIL scores and past loan history. That leaves millions of hard-working, honest individuals — with no borrowing history — completely invisible to formal lenders, pushing them toward informal moneylenders and high-interest debt traps.',
      points: [
        { title: '1. No Credit History', desc: 'First-time borrowers, zero CIBIL footprint.' },
        { title: '2. No Formal Trust Signal', desc: 'Banks have no reliable way to assess risk.' },
        { title: '3. Pushed to Moneylenders', desc: 'High interest, predatory debt traps, no consumer protection.' }
      ]
    },
    {
      number: 3,
      title: 'Why Solving This Matters',
      tag: 'Ecosystem Impact',
      subtitle: 'A well-designed alternative trust score creates value across the whole financial ecosystem',
      grid: [
        { title: 'More People Get Loans', desc: 'Millions of thin-file, first-time applicants become bankable.' },
        { title: 'Better Financial Inclusion', desc: 'Underserved workers and rural users enter the formal credit system.' },
        { title: 'Lower Dependence on Moneylenders', desc: 'Fair, transparent credit replaces predatory informal lending.' },
        { title: 'Higher Economic Growth', desc: 'Wider access to capital fuels spending, saving, and small business growth.' }
      ],
      bonus: 'Bonus: As workers build a positive alternative credit history over time, they unlock lower interest rates and stronger loan terms.'
    },
    {
      number: 4,
      title: 'A Global, Under-Addressed Opportunity',
      tag: 'Market Opportunity',
      stat: 'Millions',
      statDesc: 'of fresh, first-time users have no formal financial data trail — the ones every bank currently ignores.',
      points: [
        { title: 'Genuine Global Relevance', desc: 'Not a niche use-case; affects emerging markets everywhere, not just India.' },
        { title: 'Low Visibility Today', desc: 'Less crowded, less competition with immense untapped volume.' },
        { title: 'Real, Immediate Impact', desc: 'Directly uplifts gig workers, rural artisans, and fresh graduates.' }
      ]
    },
    {
      number: 5,
      title: 'Beyond CIBIL: Our Alternative Data Signals',
      tag: 'Core Innovation',
      subtitle: 'Rent and bill payments are especially telling — they reflect real financial discipline',
      signals: [
        'UPI Transaction History',
        'Mobile Recharge Consistency',
        'Electricity Bill Payments',
        'Rent Payments',
        'Bank Balance Trends',
        'Travel History',
        'E-commerce Purchase History',
        'Insurance Payments',
        'Aadhaar Verified Identity',
        'Employment Stability'
      ],
      footerNote: 'These 10 signals feed directly into our ML-based Trust Score engine.'
    },
    {
      number: 6,
      title: 'Our Favorite Idea: Smarter Guarantor Verification',
      tag: 'Key Differentiator',
      heroBox: 'Applicant + Guarantor: Two linked trust profiles, one stronger decision',
      points: [
        { title: '1. Meaningful Verification', desc: 'Today, guarantor verification is barely done in any meaningful way — mostly a paper signature.' },
        { title: '2. Credit Score Linking', desc: "We link the guarantor's own credit score into the model, so their financial standing strengthens the applicant's approval odds." },
        { title: '3. Verified Layer of Confidence', desc: 'Gives lenders a second, verified layer of confidence — without demanding more from the applicant themselves.' }
      ]
    },
    {
      number: 7,
      title: 'Our AI Trust Score Engine',
      tag: 'System Architecture',
      subtitle: 'Channeling AI momentum into a purpose-built ML trust predictor',
      steps: [
        { title: '1. Alternative Data + Guarantor Signals', desc: 'UPI, bills, rent, employment, identity, and linked guarantor score.' },
        { title: '2. Machine Learning Model', desc: 'Learns repayment-likelihood patterns from real financial behaviour.' },
        { title: '3. Trust Score Output', desc: 'A single explainable score banks and NBFCs can act on with confidence.' }
      ]
    },
    {
      number: 8,
      title: "What We're Building",
      tag: 'Product Pillars',
      pillars: [
        { title: 'Trust Score', desc: 'A single, explainable alternative-data credit score for new borrowers.' },
        { title: 'Risk Prediction', desc: 'ML-driven estimate of default likelihood for every applicant.' },
        { title: 'Fraud Detection', desc: 'Flags suspicious or fabricated data patterns before approval (with community signals).' },
        { title: 'Loan Recommendation', desc: 'Suggests the right loan product and terms for each profile.' },
        { title: 'Explainable AI', desc: 'Shows lenders and applicants exactly why a score was given.' }
      ]
    },
    {
      number: 9,
      title: 'Even a Lower Score Still Gets a Loan',
      tag: 'Fair Loan Sizing',
      subtitle: 'Instead of a flat rejection, our model predicts the safest loan amount to sanction.',
      tiers: [
        { name: 'Low Score', tag: 'Smaller, safer loan', desc: 'Micro-credit amount sanctioned to establish baseline repayment history.' },
        { name: 'Medium Score', tag: 'Moderate loan amount', desc: 'Standard ticket size with balanced tenure.' },
        { name: 'High Score', tag: 'Larger loan, better terms', desc: 'Prime loan sizing with competitive lowest interest rates.' }
      ],
      footerNote: 'As repayment history builds, the sanctioned amount and terms improve over time.'
    },
    {
      number: 10,
      title: 'Thank You, Mitro!',
      tag: 'Team Submission',
      subtitle: 'TrustScore — Building Credit Access for Every First-Time Borrower',
      author: 'Ayush & Vishakha | Problem Statement 1',
      type: 'closing'
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-[#0a2723] to-slate-950 border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[580px]">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Slide {slide.number} of 10
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {slide.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Body */}
        <div className="my-auto py-4 relative z-10 space-y-6">
          
          {/* Hero Slide 1 & 10 */}
          {(slide.type === 'hero' || slide.type === 'closing') && (
            <div className="text-center space-y-6 max-w-2xl mx-auto py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                {slide.title}
              </h1>
              <p className="text-lg text-emerald-300 font-medium">
                {slide.subtitle}
              </p>
              {slide.quote && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-800/40 text-slate-200 italic text-base">
                  {slide.quote}
                </div>
              )}
              <div className="text-xs text-slate-400 pt-4 font-mono">
                {slide.author}
              </div>
            </div>
          )}

          {/* Slide 2: Problem */}
          {slide.number === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-base italic text-center">
                {slide.quote}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {slide.content}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {slide.points?.map((pt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-emerald-400 font-bold text-sm font-display">{pt.title}</div>
                    <div className="text-xs text-slate-400">{pt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 3: Why Solving Matters */}
          {slide.number === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <p className="text-xs text-slate-300">{slide.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slide.grid?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-emerald-400 font-display">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-300 font-medium">
                {slide.bonus}
              </div>
            </div>
          )}

          {/* Slide 4: Global Opportunity */}
          {slide.number === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-900/60 flex flex-col sm:flex-row items-center gap-6">
                <div className="text-5xl font-black font-display text-emerald-400">{slide.stat}</div>
                <div className="text-sm text-slate-300">{slide.statDesc}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {slide.points?.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">{pt.title}</div>
                    <div className="text-[11px] text-slate-400">{pt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 5: The 10 Signals */}
          {slide.number === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
                  <p className="text-xs text-emerald-300">{slide.subtitle}</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onJumpToSignals();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Configure in App →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {slide.signals?.map((sig, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                    <span className="text-xs font-semibold text-white">{sig}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 text-center pt-2 italic">{slide.footerNote}</p>
            </div>
          )}

          {/* Slide 6: Smarter Guarantor Verification */}
          {slide.number === 6 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 font-bold text-sm text-center">
                {slide.heroBox}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {slide.points?.map((pt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-emerald-400">{pt.title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{pt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 7: AI Engine */}
          {slide.number === 7 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <p className="text-xs text-slate-400">{slide.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {slide.steps?.map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/60 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <div className="text-sm font-bold text-white">{st.title}</div>
                    <div className="text-xs text-slate-400">{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 8: What We're Building */}
          {slide.number === 8 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {slide.pillars?.map((pil, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-emerald-400">{pil.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{pil.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 9: Fair Loan Sizing */}
          {slide.number === 9 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-white">{slide.title}</h2>
              <p className="text-xs text-slate-300">{slide.subtitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {slide.tiers?.map((tr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-emerald-400 font-display">{tr.name}</div>
                    <div className="text-xs font-semibold text-white">{tr.tag}</div>
                    <div className="text-xs text-slate-400">{tr.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-300 text-center font-medium">{slide.footerNote}</p>
            </div>
          )}

        </div>

        {/* Bottom Pagination & Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 relative z-10">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-emerald-400' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
