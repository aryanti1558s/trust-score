/**
 * TrustScore - Types & Interfaces
 * AI-Powered Alternative Credit Scoring for First-Time Borrowers
 */

export type UserRole = 'borrower' | 'lender';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  city: string;
  occupation: string;
}

export type OnTimeStatus = 'always' | 'mostly' | 'irregular';
export type PaymentChannel = 'upi' | 'bank_transfer' | 'cheque' | 'cash_receipt';
export type CommuteMode = 'metro_rail_smartcard' | 'bus_pass' | 'fuel_upi' | 'ride_hailing' | 'walking_local';
export type OccupationType = 'gig_worker' | 'small_merchant' | 'salaried' | 'freelancer' | 'artisan_rural' | 'student_fresh_grad';
export type InflowRegularity = 'high' | 'medium' | 'volatile';

export interface SignalInputs {
  // 1. UPI Transaction History
  upiMonthlyVolume: number;
  upiMonthlyCount: number;
  upiMerchantRatio: number; // 0 to 100 (% of merchant scans)
  upiAutopayMandates: number; // recurring mandates active
  
  // 2. Mobile Recharge Consistency
  mobileConsistencyStreakMonths: number;
  mobileMonthlyPlanCost: number;
  mobileRechargeStatus: OnTimeStatus;
  mobileTenureMonths: number;

  // 3. Electricity Bill Payments
  electricityOnTimeMonths: number; // 0 to 12
  electricityAvgBill: number;
  electricityMeterMatch: boolean;
  electricityDisconnectionsCount: number;

  // 4. Rent Payments
  rentMonthlyAmount: number;
  rentOnTimeStreakMonths: number;
  rentPaymentChannel: PaymentChannel;
  rentReceiptsVerified: boolean;

  // 5. Bank Balance Trends
  bankAvgMonthlyBalance: number;
  bankPenaltyCount: number; // 0 to 12
  bankInflowRegularity: InflowRegularity;
  bankEmergencyBufferMonths: number;

  // 6. Travel History
  travelCommuteMode: CommuteMode;
  travelMonthlySpend: number;
  travelInterstateTripsPerYear: number;
  travelDigitalTicketingScore: number; // 0 - 100

  // 7. E-commerce Purchase History
  ecommerceMonthlyOrders: number;
  ecommercePrepaidRatio: number; // % prepaid vs COD
  ecommerceReturnRate: number; // % returns
  ecommerceAddressStabilityMonths: number;

  // 8. Insurance Payments
  insuranceHasActive: boolean;
  insuranceAnnualPremium: number;
  insurancePolicyTypes: string[]; // ['Health', 'Life', 'Crop', 'Vehicle', 'Term']
  insuranceUninterruptedYears: number;

  // 9. Aadhaar Verified Identity
  aadhaarDigiLockerVerified: boolean;
  aadhaarBiometricStatus: 'verified' | 'pending' | 'unlinked';
  aadhaarAddressStabilityYears: number;
  aadhaarPanLinked: boolean;

  // 10. Employment Stability
  employmentType: OccupationType;
  employmentMonthlyIncome: number;
  employmentTenureMonths: number;
  employmentTurnoverProofVerified: boolean;
  employmentPlatformRating?: number; // for gig workers (e.g. 4.8 / 5)

  // Smarter Guarantor Verification (Slide 6)
  hasGuarantor: boolean;
  guarantorName: string;
  guarantorRelationship: string;
  guarantorCibilScore: number; // 300 to 900
  guarantorMonthlyIncome: number;
  guarantorPanVerified: boolean;
  guarantorConsentGiven: boolean;
}

export type SignalKey = 
  | 'upi' 
  | 'mobile' 
  | 'electricity' 
  | 'rent' 
  | 'bank' 
  | 'travel' 
  | 'ecommerce' 
  | 'insurance' 
  | 'aadhaar' 
  | 'employment';

export interface SignalScoreDetail {
  key: SignalKey;
  title: string;
  score: number; // 0 to 100
  weight: number; // percentage in overall model
  status: 'exceptional' | 'good' | 'average' | 'needs_attention';
  insight: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  iconName: string;
}

export type ScoreTier = 'Prime Trust' | 'Strong Trust' | 'Moderate Trust' | 'Emerging Trust' | 'Sub-Prime';

export interface ScoringResult {
  trustScore: number; // 300 - 900
  baseScoreWithoutGuarantor: number;
  scoreTier: ScoreTier;
  defaultLikelihoodPercent: number; // e.g. 3.2%
  fraudRiskStatus: 'Clean & Verified' | 'Low Risk / Standard' | 'Review Required' | 'High Anomaly';
  fraudFlags: string[];
  
  // Loan Sanction Parameters (Slide 9)
  sanctionedLoanAmount: number; // ₹
  recommendedInterestRate: number; // % p.a.
  maxTenureMonths: number;
  monthlyEmi: number;
  requestedLoanAmount: number;
  
  // Guarantor Boost Details (Slide 6)
  guarantorBoost: {
    applied: boolean;
    pointsAdded: number;
    amountAdded: number;
    interestDiscountPercent: number;
    explanation: string;
  };

  // Signal Breakdown (Slide 5)
  signalScores: SignalScoreDetail[];
  
  // Explainable AI (Slide 8)
  positiveDrivers: string[];
  riskDrivers: string[];
  actionableRecommendations: string[];
  
  calculatedAt: string;
}

export interface DemoProfile {
  id: string;
  name: string;
  avatar: string;
  roleDescription: string;
  location: string;
  requestedLoan: number;
  loanPurpose: string;
  inputs: SignalInputs;
}
