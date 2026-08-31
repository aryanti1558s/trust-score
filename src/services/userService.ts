import { 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from '../firebase';
import { UserProfile, ScoringResult, SignalInputs } from '../types';

export interface UserDocument {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'borrower' | 'lender';
  city?: string;
  occupation?: string;
  lastLoginAt: any;
  createdAt: any;
}

/**
 * Save or update user profile and login timestamp in Firestore `users` collection
 */
export async function recordUserLogin(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.id);
    await setDoc(userRef, {
      uid: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role,
      city: profile.city || '',
      occupation: profile.occupation || '',
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore write notice (user profile):', error);
  }
}

/**
 * Save credit score calculation record in Firestore `scoring_assessments` collection
 */
export async function saveAssessmentRecord(
  user: UserProfile, 
  inputs: SignalInputs, 
  result: ScoringResult,
  requestedLoanAmount: number,
  loanPurpose: string
): Promise<string | null> {
  try {
    const assessmentCol = collection(db, 'scoring_assessments');
    const docRef = await addDoc(assessmentCol, {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      trustScore: result.trustScore,
      scoreTier: result.scoreTier,
      defaultLikelihoodPercent: result.defaultLikelihoodPercent,
      sanctionedLoanAmount: result.sanctionedLoanAmount,
      recommendedInterestRate: result.recommendedInterestRate,
      maxTenureMonths: result.maxTenureMonths,
      monthlyEmi: result.monthlyEmi,
      requestedLoanAmount,
      loanPurpose,
      fraudRiskStatus: result.fraudRiskStatus,
      guarantorApplied: result.guarantorBoost.applied,
      guarantorPointsAdded: result.guarantorBoost.pointsAdded,
      signalInputs: inputs,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore write notice (assessment record):', error);
    return null;
  }
}

/**
 * Retrieve user's previous saved assessments
 */
export async function fetchUserAssessments(userId: string) {
  try {
    const q = query(
      collection(db, 'scoring_assessments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Firestore query notice:', error);
    return [];
  }
}
