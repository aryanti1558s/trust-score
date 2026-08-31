import { DemoProfile } from '../types';

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'gig-worker',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleDescription: 'Quick-Commerce Delivery Partner (Zomato / Blinkit)',
    location: 'Bengaluru, Karnataka',
    requestedLoan: 65000,
    loanPurpose: 'Purchase Electric 2-Wheeler for Work',
    inputs: {
      upiMonthlyVolume: 38500,
      upiMonthlyCount: 142,
      upiMerchantRatio: 68,
      upiAutopayMandates: 2,

      mobileConsistencyStreakMonths: 24,
      mobileMonthlyPlanCost: 399,
      mobileRechargeStatus: 'always',
      mobileTenureMonths: 36,

      electricityOnTimeMonths: 11,
      electricityAvgBill: 1200,
      electricityMeterMatch: true,
      electricityDisconnectionsCount: 0,

      rentMonthlyAmount: 7500,
      rentOnTimeStreakMonths: 18,
      rentPaymentChannel: 'upi',
      rentReceiptsVerified: true,

      bankAvgMonthlyBalance: 8400,
      bankPenaltyCount: 0,
      bankInflowRegularity: 'high',
      bankEmergencyBufferMonths: 1.4,

      travelCommuteMode: 'fuel_upi',
      travelMonthlySpend: 3200,
      travelInterstateTripsPerYear: 2,
      travelDigitalTicketingScore: 82,

      ecommerceMonthlyOrders: 4,
      ecommercePrepaidRatio: 75,
      ecommerceReturnRate: 4,
      ecommerceAddressStabilityMonths: 22,

      insuranceHasActive: true,
      insuranceAnnualPremium: 2800,
      insurancePolicyTypes: ['Health', 'Vehicle'],
      insuranceUninterruptedYears: 2,

      aadhaarDigiLockerVerified: true,
      aadhaarBiometricStatus: 'verified',
      aadhaarAddressStabilityYears: 3,
      aadhaarPanLinked: true,

      employmentType: 'gig_worker',
      employmentMonthlyIncome: 32000,
      employmentTenureMonths: 22,
      employmentTurnoverProofVerified: true,
      employmentPlatformRating: 4.88,

      hasGuarantor: true,
      guarantorName: 'Mahesh Kumar (Elder Brother)',
      guarantorRelationship: 'sibling',
      guarantorCibilScore: 745,
      guarantorMonthlyIncome: 45000,
      guarantorPanVerified: true,
      guarantorConsentGiven: true
    }
  },
  {
    id: 'kirana-merchant',
    name: 'Anil Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleDescription: 'Kirana Grocery Store Owner (Unorganized Retail)',
    location: 'Lucknow, Uttar Pradesh',
    requestedLoan: 120000,
    loanPurpose: 'Inventory expansion & FMCG working capital',
    inputs: {
      upiMonthlyVolume: 92000,
      upiMonthlyCount: 310,
      upiMerchantRatio: 88,
      upiAutopayMandates: 3,

      mobileConsistencyStreakMonths: 36,
      mobileMonthlyPlanCost: 499,
      mobileRechargeStatus: 'always',
      mobileTenureMonths: 60,

      electricityOnTimeMonths: 12,
      electricityAvgBill: 3400,
      electricityMeterMatch: true,
      electricityDisconnectionsCount: 0,

      rentMonthlyAmount: 14000,
      rentOnTimeStreakMonths: 30,
      rentPaymentChannel: 'bank_transfer',
      rentReceiptsVerified: true,

      bankAvgMonthlyBalance: 24500,
      bankPenaltyCount: 0,
      bankInflowRegularity: 'high',
      bankEmergencyBufferMonths: 2.1,

      travelCommuteMode: 'fuel_upi',
      travelMonthlySpend: 2400,
      travelInterstateTripsPerYear: 4,
      travelDigitalTicketingScore: 70,

      ecommerceMonthlyOrders: 6,
      ecommercePrepaidRatio: 85,
      ecommerceReturnRate: 2,
      ecommerceAddressStabilityMonths: 48,

      insuranceHasActive: true,
      insuranceAnnualPremium: 6500,
      insurancePolicyTypes: ['Health', 'Life'],
      insuranceUninterruptedYears: 4,

      aadhaarDigiLockerVerified: true,
      aadhaarBiometricStatus: 'verified',
      aadhaarAddressStabilityYears: 7,
      aadhaarPanLinked: true,

      employmentType: 'small_merchant',
      employmentMonthlyIncome: 55000,
      employmentTenureMonths: 48,
      employmentTurnoverProofVerified: true,
      employmentPlatformRating: 4.9,

      hasGuarantor: true,
      guarantorName: 'Ramesh Verma (Uncle - Govt Officer)',
      guarantorRelationship: 'relative',
      guarantorCibilScore: 780,
      guarantorMonthlyIncome: 62000,
      guarantorPanVerified: true,
      guarantorConsentGiven: true
    }
  },
  {
    id: 'rural-artisan',
    name: 'Sunita Devi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    roleDescription: 'Self-Employed Tailor & Handicrafts Maker (Rural SHG)',
    location: 'Ranchi, Jharkhand',
    requestedLoan: 35000,
    loanPurpose: 'High-speed industrial sewing machine purchase',
    inputs: {
      upiMonthlyVolume: 14500,
      upiMonthlyCount: 45,
      upiMerchantRatio: 40,
      upiAutopayMandates: 0,

      mobileConsistencyStreakMonths: 14,
      mobileMonthlyPlanCost: 239,
      mobileRechargeStatus: 'always',
      mobileTenureMonths: 24,

      electricityOnTimeMonths: 10,
      electricityAvgBill: 650,
      electricityMeterMatch: true,
      electricityDisconnectionsCount: 0,

      rentMonthlyAmount: 2500,
      rentOnTimeStreakMonths: 12,
      rentPaymentChannel: 'cash_receipt',
      rentReceiptsVerified: true,

      bankAvgMonthlyBalance: 4200,
      bankPenaltyCount: 1,
      bankInflowRegularity: 'medium',
      bankEmergencyBufferMonths: 1.1,

      travelCommuteMode: 'bus_pass',
      travelMonthlySpend: 800,
      travelInterstateTripsPerYear: 0,
      travelDigitalTicketingScore: 50,

      ecommerceMonthlyOrders: 1,
      ecommercePrepaidRatio: 50,
      ecommerceReturnRate: 0,
      ecommerceAddressStabilityMonths: 36,

      insuranceHasActive: true,
      insuranceAnnualPremium: 1200,
      insurancePolicyTypes: ['Crop', 'Health'],
      insuranceUninterruptedYears: 1,

      aadhaarDigiLockerVerified: true,
      aadhaarBiometricStatus: 'verified',
      aadhaarAddressStabilityYears: 5,
      aadhaarPanLinked: true,

      employmentType: 'artisan_rural',
      employmentMonthlyIncome: 18500,
      employmentTenureMonths: 30,
      employmentTurnoverProofVerified: true,
      employmentPlatformRating: undefined,

      hasGuarantor: false,
      guarantorName: '',
      guarantorRelationship: '',
      guarantorCibilScore: 0,
      guarantorMonthlyIncome: 0,
      guarantorPanVerified: false,
      guarantorConsentGiven: false
    }
  },
  {
    id: 'fresh-grad',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    roleDescription: 'Junior UI Designer & Freelancer (First Job, Zero CIBIL)',
    location: 'Pune, Maharashtra',
    requestedLoan: 80000,
    loanPurpose: 'M3 MacBook Pro for Freelance Design Contracts',
    inputs: {
      upiMonthlyVolume: 42000,
      upiMonthlyCount: 160,
      upiMerchantRatio: 72,
      upiAutopayMandates: 4,

      mobileConsistencyStreakMonths: 28,
      mobileMonthlyPlanCost: 719,
      mobileRechargeStatus: 'always',
      mobileTenureMonths: 48,

      electricityOnTimeMonths: 12,
      electricityAvgBill: 1600,
      electricityMeterMatch: false, // shared flat
      electricityDisconnectionsCount: 0,

      rentMonthlyAmount: 11000,
      rentOnTimeStreakMonths: 10,
      rentPaymentChannel: 'upi',
      rentReceiptsVerified: true,

      bankAvgMonthlyBalance: 16500,
      bankPenaltyCount: 0,
      bankInflowRegularity: 'high',
      bankEmergencyBufferMonths: 1.8,

      travelCommuteMode: 'metro_rail_smartcard',
      travelMonthlySpend: 2100,
      travelInterstateTripsPerYear: 3,
      travelDigitalTicketingScore: 94,

      ecommerceMonthlyOrders: 9,
      ecommercePrepaidRatio: 90,
      ecommerceReturnRate: 5,
      ecommerceAddressStabilityMonths: 14,

      insuranceHasActive: true,
      insuranceAnnualPremium: 4200,
      insurancePolicyTypes: ['Health'],
      insuranceUninterruptedYears: 1,

      aadhaarDigiLockerVerified: true,
      aadhaarBiometricStatus: 'verified',
      aadhaarAddressStabilityYears: 2,
      aadhaarPanLinked: true,

      employmentType: 'freelancer',
      employmentMonthlyIncome: 42000,
      employmentTenureMonths: 11,
      employmentTurnoverProofVerified: true,
      employmentPlatformRating: 4.95,

      hasGuarantor: true,
      guarantorName: 'Dr. Alok Sharma (Father)',
      guarantorRelationship: 'parent',
      guarantorCibilScore: 810,
      guarantorMonthlyIncome: 110000,
      guarantorPanVerified: true,
      guarantorConsentGiven: true
    }
  }
];

export const INITIAL_INPUTS = DEMO_PROFILES[0].inputs;
