import { SignalInputs, ScoringResult, SignalScoreDetail, ScoreTier } from '../types';

export function calculateTrustScore(inputs: SignalInputs, requestedLoanAmount: number = 50000): ScoringResult {
  // 1. UPI Transaction History (Weight: 15%)
  // High frequency + regular merchant UPI indicates vibrant daily economic cashflow
  let upiScore = 0;
  if (inputs.upiMonthlyCount >= 100) upiScore += 40;
  else if (inputs.upiMonthlyCount >= 40) upiScore += 30;
  else if (inputs.upiMonthlyCount >= 15) upiScore += 20;
  else upiScore += 10;

  if (inputs.upiMonthlyVolume >= 50000) upiScore += 30;
  else if (inputs.upiMonthlyVolume >= 20000) upiScore += 25;
  else if (inputs.upiMonthlyVolume >= 8000) upiScore += 18;
  else upiScore += 10;

  if (inputs.upiMerchantRatio >= 60) upiScore += 20;
  else if (inputs.upiMerchantRatio >= 30) upiScore += 15;
  else upiScore += 8;

  if (inputs.upiAutopayMandates >= 2) upiScore += 10;
  else if (inputs.upiAutopayMandates === 1) upiScore += 6;
  upiScore = Math.min(100, upiScore);

  // 2. Mobile Recharge Consistency (Weight: 8%)
  // Unbroken mobile connectivity shows habit and financial discipline
  let mobileScore = 0;
  if (inputs.mobileRechargeStatus === 'always') mobileScore += 45;
  else if (inputs.mobileRechargeStatus === 'mostly') mobileScore += 30;
  else mobileScore += 15;

  if (inputs.mobileConsistencyStreakMonths >= 24) mobileScore += 35;
  else if (inputs.mobileConsistencyStreakMonths >= 12) mobileScore += 25;
  else if (inputs.mobileConsistencyStreakMonths >= 6) mobileScore += 15;
  else mobileScore += 8;

  if (inputs.mobileTenureMonths >= 24) mobileScore += 20;
  else if (inputs.mobileTenureMonths >= 12) mobileScore += 12;
  else mobileScore += 5;
  mobileScore = Math.min(100, mobileScore);

  // 3. Electricity Bill Payments (Weight: 12%)
  // Utility bills reflect household stability and reliable bill discipline
  let electricityScore = 0;
  const onTimeRatio = Math.min(12, inputs.electricityOnTimeMonths) / 12;
  electricityScore += Math.round(onTimeRatio * 60);

  if (inputs.electricityMeterMatch) electricityScore += 25;
  else electricityScore += 12;

  if (inputs.electricityDisconnectionsCount === 0) electricityScore += 15;
  else electricityScore -= inputs.electricityDisconnectionsCount * 10;
  electricityScore = Math.max(10, Math.min(100, electricityScore));

  // 4. Rent Payments (Weight: 15%)
  // Highest indicator of regular recurring contractual obligation discipline
  let rentScore = 0;
  if (inputs.rentOnTimeStreakMonths >= 24) rentScore += 50;
  else if (inputs.rentOnTimeStreakMonths >= 12) rentScore += 40;
  else if (inputs.rentOnTimeStreakMonths >= 6) rentScore += 28;
  else rentScore += 15;

  if (inputs.rentPaymentChannel === 'upi' || inputs.rentPaymentChannel === 'bank_transfer') {
    rentScore += 30;
  } else if (inputs.rentPaymentChannel === 'cheque') {
    rentScore += 25;
  } else {
    rentScore += 15;
  }

  if (inputs.rentReceiptsVerified) rentScore += 20;
  else rentScore += 5;
  rentScore = Math.min(100, rentScore);

  // 5. Bank Balance Trends (Weight: 12%)
  // Average balance & zero penalties
  let bankScore = 0;
  if (inputs.bankAvgMonthlyBalance >= 25000) bankScore += 40;
  else if (inputs.bankAvgMonthlyBalance >= 10000) bankScore += 32;
  else if (inputs.bankAvgMonthlyBalance >= 4000) bankScore += 22;
  else bankScore += 12;

  if (inputs.bankPenaltyCount === 0) bankScore += 25;
  else if (inputs.bankPenaltyCount === 1) bankScore += 12;
  else bankScore += 0;

  if (inputs.bankInflowRegularity === 'high') bankScore += 20;
  else if (inputs.bankInflowRegularity === 'medium') bankScore += 12;
  else bankScore += 5;

  if (inputs.bankEmergencyBufferMonths >= 2) bankScore += 15;
  else if (inputs.bankEmergencyBufferMonths >= 1) bankScore += 10;
  else bankScore += 5;
  bankScore = Math.min(100, bankScore);

  // 6. Travel History (Weight: 6%)
  // Daily commute regularity shows steady active employment
  let travelScore = 0;
  if (inputs.travelCommuteMode === 'metro_rail_smartcard' || inputs.travelCommuteMode === 'bus_pass') travelScore += 45;
  else if (inputs.travelCommuteMode === 'fuel_upi') travelScore += 40;
  else if (inputs.travelCommuteMode === 'ride_hailing') travelScore += 35;
  else travelScore += 25;

  travelScore += Math.round((inputs.travelDigitalTicketingScore / 100) * 35);
  if (inputs.travelInterstateTripsPerYear >= 2) travelScore += 20;
  else travelScore += 10;
  travelScore = Math.min(100, travelScore);

  // 7. E-commerce Purchase History (Weight: 7%)
  // Prepaid behavior and low returns signal high digital trust & low fraud propensity
  let ecomScore = 0;
  if (inputs.ecommercePrepaidRatio >= 80) ecomScore += 45;
  else if (inputs.ecommercePrepaidRatio >= 50) ecomScore += 32;
  else ecomScore += 15;

  if (inputs.ecommerceReturnRate <= 5) ecomScore += 30;
  else if (inputs.ecommerceReturnRate <= 15) ecomScore += 20;
  else ecomScore += 5;

  if (inputs.ecommerceAddressStabilityMonths >= 18) ecomScore += 25;
  else if (inputs.ecommerceAddressStabilityMonths >= 6) ecomScore += 15;
  else ecomScore += 8;
  ecomScore = Math.min(100, ecomScore);

  // 8. Insurance Payments (Weight: 7%)
  // Active insurance policies denote proactive risk-mitigation mindset
  let insuranceScore = 0;
  if (inputs.insuranceHasActive) {
    insuranceScore += 35;
    insuranceScore += Math.min(30, (inputs.insurancePolicyTypes.length || 1) * 15);
    if (inputs.insuranceUninterruptedYears >= 3) insuranceScore += 35;
    else if (inputs.insuranceUninterruptedYears >= 1) insuranceScore += 25;
    else insuranceScore += 15;
  } else {
    insuranceScore = 25; // neutral baseline
  }
  insuranceScore = Math.min(100, insuranceScore);

  // 9. Aadhaar Verified Identity (Weight: 8%)
  // DigiLocker KYC, PAN linking, address stability
  let aadhaarScore = 0;
  if (inputs.aadhaarDigiLockerVerified) aadhaarScore += 40;
  if (inputs.aadhaarPanLinked) aadhaarScore += 25;
  if (inputs.aadhaarBiometricStatus === 'verified') aadhaarScore += 20;
  else if (inputs.aadhaarBiometricStatus === 'pending') aadhaarScore += 10;

  if (inputs.aadhaarAddressStabilityYears >= 3) aadhaarScore += 15;
  else if (inputs.aadhaarAddressStabilityYears >= 1) aadhaarScore += 10;
  else aadhaarScore += 5;
  aadhaarScore = Math.min(100, aadhaarScore);

  // 10. Employment Stability (Weight: 10%)
  // Consistent tenure and verifiable platform or turnover proof
  let employmentScore = 0;
  if (inputs.employmentTenureMonths >= 24) employmentScore += 40;
  else if (inputs.employmentTenureMonths >= 12) employmentScore += 30;
  else if (inputs.employmentTenureMonths >= 6) employmentScore += 20;
  else employmentScore += 10;

  if (inputs.employmentTurnoverProofVerified) employmentScore += 35;
  else employmentScore += 15;

  if (inputs.employmentPlatformRating && inputs.employmentPlatformRating >= 4.7) employmentScore += 25;
  else if (inputs.employmentMonthlyIncome >= 30000) employmentScore += 25;
  else if (inputs.employmentMonthlyIncome >= 15000) employmentScore += 18;
  else employmentScore += 10;
  employmentScore = Math.min(100, employmentScore);

  // Signal Score Details & Weights
  const signalScores: SignalScoreDetail[] = [
    {
      key: 'upi',
      title: 'UPI Transaction History',
      score: upiScore,
      weight: 15,
      status: upiScore >= 80 ? 'exceptional' : upiScore >= 65 ? 'good' : upiScore >= 45 ? 'average' : 'needs_attention',
      insight: `${inputs.upiMonthlyCount} monthly transactions (~₹${inputs.upiMonthlyVolume.toLocaleString('en-IN')}) with ${inputs.upiMerchantRatio}% merchant QR payments.`,
      keyMetricLabel: 'Monthly Activity',
      keyMetricValue: `${inputs.upiMonthlyCount} txns / mo`,
      iconName: 'Smartphone'
    },
    {
      key: 'mobile',
      title: 'Mobile Recharge Consistency',
      score: mobileScore,
      weight: 8,
      status: mobileScore >= 80 ? 'exceptional' : mobileScore >= 65 ? 'good' : mobileScore >= 45 ? 'average' : 'needs_attention',
      insight: `${inputs.mobileConsistencyStreakMonths} months of unbroken on-time plan recharges on a ${inputs.mobileTenureMonths}-month SIM tenure.`,
      keyMetricLabel: 'Recharge Streak',
      keyMetricValue: `${inputs.mobileConsistencyStreakMonths} Mos On-Time`,
      iconName: 'Radio'
    },
    {
      key: 'electricity',
      title: 'Electricity Bill Payments',
      score: electricityScore,
      weight: 12,
      status: electricityScore >= 80 ? 'exceptional' : electricityScore >= 65 ? 'good' : electricityScore >= 45 ? 'average' : 'needs_attention',
      insight: `${inputs.electricityOnTimeMonths}/12 bills cleared on time with zero disconnection flags.`,
      keyMetricLabel: 'Timely Bills',
      keyMetricValue: `${inputs.electricityOnTimeMonths}/12 Months`,
      iconName: 'Zap'
    },
    {
      key: 'rent',
      title: 'Rent Payments',
      score: rentScore,
      weight: 15,
      status: rentScore >= 80 ? 'exceptional' : rentScore >= 65 ? 'good' : rentScore >= 45 ? 'average' : 'needs_attention',
      insight: `₹${inputs.rentMonthlyAmount.toLocaleString('en-IN')}/mo paid over a ${inputs.rentOnTimeStreakMonths}-month continuous verified streak.`,
      keyMetricLabel: 'Rent Regularity',
      keyMetricValue: `${inputs.rentOnTimeStreakMonths} Mos Streak`,
      iconName: 'Home'
    },
    {
      key: 'bank',
      title: 'Bank Balance Trends',
      score: bankScore,
      weight: 12,
      status: bankScore >= 80 ? 'exceptional' : bankScore >= 65 ? 'good' : bankScore >= 45 ? 'average' : 'needs_attention',
      insight: `Average monthly balance of ₹${inputs.bankAvgMonthlyBalance.toLocaleString('en-IN')} with ${inputs.bankPenaltyCount} penalty breaches.`,
      keyMetricLabel: 'Avg Monthly Balance',
      keyMetricValue: `₹${inputs.bankAvgMonthlyBalance.toLocaleString('en-IN')}`,
      iconName: 'Landmark'
    },
    {
      key: 'travel',
      title: 'Travel History & Transit',
      score: travelScore,
      weight: 6,
      status: travelScore >= 80 ? 'exceptional' : travelScore >= 65 ? 'good' : travelScore >= 45 ? 'average' : 'needs_attention',
      insight: `Consistent commuter footprint (${inputs.travelCommuteMode.replace(/_/g, ' ')}) with digital transit footprint.`,
      keyMetricLabel: 'Transit Index',
      keyMetricValue: `${travelScore}/100 Transit Score`,
      iconName: 'PlaneTakeoff'
    },
    {
      key: 'ecommerce',
      title: 'E-commerce Purchase History',
      score: ecomScore,
      weight: 7,
      status: ecomScore >= 80 ? 'exceptional' : ecomScore >= 65 ? 'good' : ecomScore >= 45 ? 'average' : 'needs_attention',
      insight: `${inputs.ecommercePrepaidRatio}% digital prepaid orders with an ultra-low return rate (${inputs.ecommerceReturnRate}%).`,
      keyMetricLabel: 'Prepaid Digital Orders',
      keyMetricValue: `${inputs.ecommercePrepaidRatio}% Prepaid`,
      iconName: 'ShoppingBag'
    },
    {
      key: 'insurance',
      title: 'Insurance & Protection',
      score: insuranceScore,
      weight: 7,
      status: insuranceScore >= 80 ? 'exceptional' : insuranceScore >= 65 ? 'good' : insuranceScore >= 45 ? 'average' : 'needs_attention',
      insight: inputs.insuranceHasActive 
        ? `${inputs.insurancePolicyTypes.join(', ')} policies held uninterrupted for ${inputs.insuranceUninterruptedYears} years.`
        : 'No active formal insurance policies linked yet.',
      keyMetricLabel: 'Active Cover',
      keyMetricValue: inputs.insuranceHasActive ? `${inputs.insurancePolicyTypes.length} Policies` : 'None',
      iconName: 'ShieldCheck'
    },
    {
      key: 'aadhaar',
      title: 'Aadhaar Verified Identity',
      score: aadhaarScore,
      weight: 8,
      status: aadhaarScore >= 80 ? 'exceptional' : aadhaarScore >= 65 ? 'good' : aadhaarScore >= 45 ? 'average' : 'needs_attention',
      insight: `DigiLocker KYC ${inputs.aadhaarDigiLockerVerified ? 'Completed' : 'Pending'}, PAN ${inputs.aadhaarPanLinked ? 'Linked' : 'Unlinked'}, ${inputs.aadhaarAddressStabilityYears} yrs address tenure.`,
      keyMetricLabel: 'KYC Status',
      keyMetricValue: inputs.aadhaarDigiLockerVerified ? '100% DigiLocker Verified' : 'Manual Review',
      iconName: 'UserCheck'
    },
    {
      key: 'employment',
      title: 'Employment & Income Stability',
      score: employmentScore,
      weight: 10,
      status: employmentScore >= 80 ? 'exceptional' : employmentScore >= 65 ? 'good' : employmentScore >= 45 ? 'average' : 'needs_attention',
      insight: `Verified monthly earnings of ₹${inputs.employmentMonthlyIncome.toLocaleString('en-IN')} over ${inputs.employmentTenureMonths} months in ${inputs.employmentType.replace(/_/g, ' ')}.`,
      keyMetricLabel: 'Monthly Verified Inflow',
      keyMetricValue: `₹${inputs.employmentMonthlyIncome.toLocaleString('en-IN')}`,
      iconName: 'Briefcase'
    }
  ];

  // Weighted aggregate composite calculation (0 - 100)
  const compositeIndex = signalScores.reduce((acc, sig) => acc + (sig.score * (sig.weight / 100)), 0);

  // Map 0 - 100 to standard 300 - 900 CIBIL-comparable alternative trust score
  // 300 base + (compositeIndex * 6)
  const rawBaseScore = Math.round(300 + (compositeIndex * 6));
  const baseScoreWithoutGuarantor = Math.min(900, Math.max(300, rawBaseScore));

  // Guarantor Boost (Slide 6 - Smarter Guarantor Verification)
  let guarantorPoints = 0;
  let guarantorLoanMultiplier = 1.0;
  let guarantorInterestDiscount = 0;
  let guarantorExplanation = 'No linked guarantor profile provided.';

  if (inputs.hasGuarantor && inputs.guarantorConsentGiven && inputs.guarantorPanVerified) {
    if (inputs.guarantorCibilScore >= 780) {
      guarantorPoints = 55;
      guarantorLoanMultiplier = 1.45;
      guarantorInterestDiscount = 2.25;
      guarantorExplanation = `Linked prime guarantor (${inputs.guarantorName}, CIBIL ${inputs.guarantorCibilScore}) provides strong credit backstop.`;
    } else if (inputs.guarantorCibilScore >= 720) {
      guarantorPoints = 40;
      guarantorLoanMultiplier = 1.30;
      guarantorInterestDiscount = 1.5;
      guarantorExplanation = `Linked strong guarantor (${inputs.guarantorName}, CIBIL ${inputs.guarantorCibilScore}) strengthens approval odds.`;
    } else if (inputs.guarantorCibilScore >= 650) {
      guarantorPoints = 25;
      guarantorLoanMultiplier = 1.15;
      guarantorInterestDiscount = 0.75;
      guarantorExplanation = `Linked guarantor (${inputs.guarantorName}) adds positive secondary trust anchor.`;
    } else {
      guarantorPoints = 10;
      guarantorExplanation = `Guarantor added with neutral credit footprint.`;
    }
  }

  const finalTrustScore = Math.min(900, baseScoreWithoutGuarantor + guarantorPoints);

  // Determine Score Tier
  let scoreTier: ScoreTier = 'Moderate Trust';
  if (finalTrustScore >= 780) scoreTier = 'Prime Trust';
  else if (finalTrustScore >= 710) scoreTier = 'Strong Trust';
  else if (finalTrustScore >= 630) scoreTier = 'Moderate Trust';
  else if (finalTrustScore >= 520) scoreTier = 'Emerging Trust';
  else scoreTier = 'Sub-Prime';

  // Default Likelihood (Slide 8: ML-driven estimate of default likelihood)
  // Higher score -> lower default rate (e.g. 780+ is ~1.8% - 3.5%, 520 is ~11.5%)
  const defaultLikelihoodPercent = Math.max(1.2, Number((24 - (finalTrustScore - 300) * 0.035).toFixed(1)));

  // Fraud Detection Checks (Slide 8: Flags suspicious or fabricated data patterns)
  const fraudFlags: string[] = [];
  if (inputs.upiMonthlyVolume > inputs.employmentMonthlyIncome * 5 && inputs.employmentType !== 'small_merchant') {
    fraudFlags.push('UPI volume significantly diverges from declared employment profile');
  }
  if (!inputs.aadhaarDigiLockerVerified) {
    fraudFlags.push('DigiLocker identity match pending manual verification');
  }
  if (inputs.rentMonthlyAmount > inputs.employmentMonthlyIncome * 0.8) {
    fraudFlags.push('Rent-to-income ratio exceeds 80% sustainability threshold');
  }
  if (inputs.bankPenaltyCount >= 4) {
    fraudFlags.push('High frequency of minimum balance non-maintenance charges');
  }

  let fraudRiskStatus: ScoringResult['fraudRiskStatus'] = 'Clean & Verified';
  if (fraudFlags.length === 0) fraudRiskStatus = 'Clean & Verified';
  else if (fraudFlags.length === 1) fraudRiskStatus = 'Low Risk / Standard';
  else if (fraudFlags.length === 2) fraudRiskStatus = 'Review Required';
  else fraudRiskStatus = 'High Anomaly';

  // Loan Sizing & Terms (Slide 9: "Even a Lower Score Still Gets a Loan")
  // High Score: Larger loan, better terms (up to 4x-6x income)
  // Medium Score: Moderate loan amount (up to 2.5x-3.5x income)
  // Low Score: Smaller, safer loan (1x-1.5x income)
  const monthlyIncome = Math.max(10000, inputs.employmentMonthlyIncome);
  let maxIncomeMultiplier = 1.5;
  let baseInterestRate = 18.5;
  let maxTenure = 12;

  if (finalTrustScore >= 780) {
    maxIncomeMultiplier = 5.0;
    baseInterestRate = 11.99;
    maxTenure = 36;
  } else if (finalTrustScore >= 710) {
    maxIncomeMultiplier = 3.8;
    baseInterestRate = 13.75;
    maxTenure = 24;
  } else if (finalTrustScore >= 630) {
    maxIncomeMultiplier = 2.6;
    baseInterestRate = 15.5;
    maxTenure = 18;
  } else if (finalTrustScore >= 520) {
    maxIncomeMultiplier = 1.6;
    baseInterestRate = 17.5;
    maxTenure = 12;
  } else {
    maxIncomeMultiplier = 1.0;
    baseInterestRate = 19.5;
    maxTenure = 9;
  }

  const baseSanctionCap = Math.round(monthlyIncome * maxIncomeMultiplier);
  const totalSanctionCap = Math.round(baseSanctionCap * guarantorLoanMultiplier);
  const sanctionedLoanAmount = Math.min(totalSanctionCap, Math.max(15000, requestedLoanAmount));
  const finalInterestRate = Math.max(9.99, Number((baseInterestRate - guarantorInterestDiscount).toFixed(2)));

  // Calculate monthly EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = (finalInterestRate / 100) / 12;
  const n = maxTenure;
  const emi = Math.round((sanctionedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));

  // Explainable AI Factors (Slide 8)
  const positiveDrivers: string[] = [];
  const riskDrivers: string[] = [];
  const actionableRecommendations: string[] = [];

  // Evaluate Drivers
  if (rentScore >= 75) positiveDrivers.push(`Strong rental payment discipline with ${inputs.rentOnTimeStreakMonths} consecutive on-time records`);
  else riskDrivers.push(`Short or irregular rent payment verification history (${inputs.rentOnTimeStreakMonths} months)`);

  if (electricityScore >= 75) positiveDrivers.push(`Reliable electricity utility bill payment consistency (${inputs.electricityOnTimeMonths}/12 cleared on-time)`);
  else if (inputs.electricityOnTimeMonths < 9) riskDrivers.push(`Electricity bill delays detected in ${12 - inputs.electricityOnTimeMonths} of the last 12 months`);

  if (upiScore >= 75) positiveDrivers.push(`High UPI digital payment velocity with ${inputs.upiMonthlyCount} monthly active transactions`);
  else if (inputs.upiMonthlyCount < 30) riskDrivers.push(`Limited UPI digital transaction footprint`);

  if (mobileScore >= 80) positiveDrivers.push(`Unbroken mobile recharge discipline spanning ${inputs.mobileConsistencyStreakMonths} months`);
  
  if (inputs.aadhaarDigiLockerVerified && inputs.aadhaarPanLinked) {
    positiveDrivers.push('Full Aadhaar + DigiLocker + PAN paperless KYC authentication');
  }

  if (inputs.hasGuarantor && inputs.guarantorCibilScore >= 720) {
    positiveDrivers.push(`Credit-worthy guarantor (${inputs.guarantorName}) providing cross-verification backstop`);
  }

  // Recommendations to Level Up
  if (inputs.bankPenaltyCount > 0) {
    actionableRecommendations.push('Maintain minimum balance to prevent penalty charges over the next 90 days (+18 pts)');
  }
  if (!inputs.insuranceHasActive) {
    actionableRecommendations.push('Enroll in a micro-insurance or health cover policy like PMJJBY/PMSBY to demonstrate risk preparedness (+22 pts)');
  }
  if (inputs.upiAutopayMandates === 0) {
    actionableRecommendations.push('Set up UPI Autopay for utility or broadband recharges (+15 pts)');
  }
  if (!inputs.hasGuarantor) {
    actionableRecommendations.push('Link a family member with a positive credit history as a smart guarantor (+35 to +55 pts)');
  }
  if (inputs.ecommercePrepaidRatio < 60) {
    actionableRecommendations.push('Switch more e-commerce and delivery orders to prepaid digital UPI instead of Cash on Delivery (+12 pts)');
  }

  return {
    trustScore: finalTrustScore,
    baseScoreWithoutGuarantor,
    scoreTier,
    defaultLikelihoodPercent,
    fraudRiskStatus,
    fraudFlags,
    sanctionedLoanAmount,
    recommendedInterestRate: finalInterestRate,
    maxTenureMonths: maxTenure,
    monthlyEmi: emi,
    requestedLoanAmount,
    guarantorBoost: {
      applied: inputs.hasGuarantor && inputs.guarantorConsentGiven,
      pointsAdded: guarantorPoints,
      amountAdded: totalSanctionCap - baseSanctionCap,
      interestDiscountPercent: guarantorInterestDiscount,
      explanation: guarantorExplanation
    },
    signalScores,
    positiveDrivers,
    riskDrivers,
    actionableRecommendations,
    calculatedAt: new Date().toISOString()
  };
}
