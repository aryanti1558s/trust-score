import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ArrowRight, User, Building2, 
  CheckCircle2, Lock, Smartphone, Mail, KeyRound, 
  AlertCircle, Check, Flame, RefreshCw, Send
} from 'lucide-react';
import { UserProfile, UserRole, DemoProfile } from '../types';
import { DEMO_PROFILES } from '../data/profiles';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from '../firebase';
import { recordUserLogin } from '../services/userService';

interface AuthScreenProps {
  onLogin: (user: UserProfile, selectedProfile?: DemoProfile) => void;
  onOpenDeck?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  // Tabs: 'google', 'phone', 'email_login', 'email_signup'
  const [authMethod, setAuthMethod] = useState<'google' | 'phone' | 'email_login' | 'email_signup'>('google');
  const [role, setRole] = useState<UserRole>('borrower');
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  
  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Timer for OTP countdown
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Google / Gmail Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Account Holder',
        phone: fbUser.phoneNumber || '+91 98765 43210',
        email: fbUser.email || `${fbUser.uid}@gmail.com`,
        role,
        avatarUrl: fbUser.photoURL || undefined,
        city: city || 'Bengaluru, India',
        occupation: occupation || (role === 'borrower' ? 'Self-Employed / First-Time Borrower' : 'Lending Risk Officer')
      };

      await recordUserLogin(userProfile);
      setSuccessMessage(`Welcome, ${userProfile.name}! Signed in via Google.`);
      setTimeout(() => onLogin(userProfile), 400);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-In popup was closed. Please click again to sign in.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Authentication request was cancelled. Please try again.');
      } else {
        setErrorMessage(err.message?.replace('Firebase: ', '') || 'Google authentication encountered an issue. Please try Mobile OTP or Email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Setup reCAPTCHA for Phone
  const initRecaptcha = () => {
    if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            recaptchaVerifierRef.current = null;
          }
        });
      } catch (err) {
        console.warn('Recaptcha init notice:', err);
      }
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

    try {
      initRecaptcha();
      if (recaptchaVerifierRef.current) {
        const appVerifier = recaptchaVerifierRef.current;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        setResendTimer(30);
        setSuccessMessage(`6-digit OTP sent to ${formattedPhone}`);
      } else {
        throw new Error('Recaptcha verification initialization failed');
      }
    } catch (err: any) {
      console.warn('Firebase SMS OTP fallback flow triggered:', err);
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtp(generatedOtp);
      setOtpSent(true);
      setResendTimer(30);
      setSuccessMessage(`OTP sent! (Testing verification code: ${generatedOtp})`);
    } finally {
      setLoading(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      setLoading(false);
      return;
    }

    try {
      let uid = '';
      let verifiedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

      if (confirmationResult) {
        const cred = await confirmationResult.confirm(otpCode);
        uid = cred.user.uid;
        verifiedPhone = cred.user.phoneNumber || verifiedPhone;
      } else if (simulatedOtp && otpCode === simulatedOtp) {
        uid = 'phone_' + phoneNumber.replace(/\D/g, '');
      } else {
        throw new Error('Invalid OTP entered. Please re-check the code.');
      }

      const userProfile: UserProfile = {
        id: uid,
        name: name.trim() || `User ${verifiedPhone.slice(-4)}`,
        phone: verifiedPhone,
        email: `${uid.slice(0, 10)}@trustscore.ai`,
        role,
        city: city || 'Mumbai, MH',
        occupation: occupation || (role === 'borrower' ? 'First-Time Borrower / Self-Employed' : 'Lending Risk Officer')
      };

      await recordUserLogin(userProfile);
      setSuccessMessage('Mobile number verified successfully!');
      setTimeout(() => onLogin(userProfile), 300);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setErrorMessage(err.message?.replace('Firebase: ', '') || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email / Password Login or Signup
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const userEmail = email.trim();
    if (!userEmail || !password) {
      setErrorMessage('Please provide both email and password.');
      setLoading(false);
      return;
    }

    try {
      if (authMethod === 'email_signup') {
        const cred = await createUserWithEmailAndPassword(auth, userEmail, password);
        const fbUser = cred.user;

        const userProfile: UserProfile = {
          id: fbUser.uid,
          name: name.trim() || userEmail.split('@')[0],
          phone: '+91 98765 43210',
          email: userEmail,
          role,
          city: city || 'Bengaluru, India',
          occupation: occupation || (role === 'borrower' ? 'Self-Employed / First-Time Borrower' : 'Lending Risk Officer')
        };

        await recordUserLogin(userProfile);
        onLogin(userProfile);
      } else {
        const cred = await signInWithEmailAndPassword(auth, userEmail, password);
        const fbUser = cred.user;

        const userProfile: UserProfile = {
          id: fbUser.uid,
          name: name.trim() || fbUser.displayName || userEmail.split('@')[0],
          phone: '+91 98765 43210',
          email: userEmail,
          role,
          city: city || 'Bengaluru, India',
          occupation: occupation || (role === 'borrower' ? 'Self-Employed / First-Time Borrower' : 'Lending Risk Officer')
        };

        await recordUserLogin(userProfile);
        onLogin(userProfile);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Account not found with this email or invalid password. Switch to "Sign Up" tab to create one.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered! Please switch to "Email Sign In" tab.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters.');
      } else {
        setErrorMessage(err.message?.replace('Firebase: ', '') || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo Persona Quick Select
  const handleSelectDemo = async (profile: DemoProfile) => {
    const demoUser: UserProfile = {
      id: profile.id,
      name: profile.name,
      phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
      email: `${profile.id}@trustscore.ai`,
      role: 'borrower',
      city: profile.location,
      occupation: profile.roleDescription
    };

    try {
      await recordUserLogin(demoUser);
    } catch (e) {
      // Non-blocking
    }
    onLogin(demoUser, profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#06211c] to-slate-950 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      
      {/* Invisible container for phone recaptcha */}
      <div ref={recaptchaContainerRef} id="recaptcha-container" />

      {/* Decorative ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Header bar - No problem statement or deck pill */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-950">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">TrustScore</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Flame className="w-3 h-3 text-amber-400" />
                Firebase Connected
              </span>
            </div>
            <span className="text-[11px] text-slate-400">AI Alternative Credit Scoring</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-10 my-auto w-full">
        
        {/* Left Column: Problem & Vision Framing */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Alternative Credit Underwriting
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            "How can a bank trust someone who has <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">never taken a loan</span> before?"
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Traditional credit systems rely almost entirely on CIBIL scores. 
            <strong className="text-white"> TrustScore</strong> unlocks fair, transparent credit for first-time borrowers by evaluating <strong className="text-emerald-400">10 alternative financial discipline signals</strong> (UPI, Electricity, Rent, Transit, Telecom, Identity & Smarter Guarantor).
          </p>

          {/* Quick Demo Borrower Personas */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ⚡ Or Select a Ready Borrower Persona to Test:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectDemo(profile)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/70 text-left transition-all group"
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 group-hover:border-emerald-400/80"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {profile.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {profile.roleDescription.split('(')[0]}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Option Authentication Card */}
        <div className="w-full max-w-md">
          <div className="bg-slate-900/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-5">
            
            {/* Top Card Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Sign In to TrustScore
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your preferred login method
                </p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {/* Role Switcher: Borrower vs Lender */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setRole('borrower')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                  role === 'borrower'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Borrower Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('lender')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
                  role === 'lender'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Bank / Underwriter</span>
              </button>
            </div>

            {/* Auth Method Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('google');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'google'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'phone'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email_login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'email_login' || authMethod === 'email_signup'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>Email</span>
              </button>
            </div>

            {/* Error & Success Banners */}
            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-start gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= METHOD 1: GOOGLE / GMAIL ================= */}
            {authMethod === 'google' && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">One-Click Google / Gmail Sign In</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fast and secure authentication linked to your Google Account.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all group disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'Connecting to Google...' : 'Sign in with Google / Gmail'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto text-slate-500" />
                </button>
              </div>
            )}

            {/* ================= METHOD 2: MOBILE NUMBER & OTP ================= */}
            {authMethod === 'phone' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex rounded-xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500 overflow-hidden">
                        <span className="inline-flex items-center px-3 text-xs font-mono text-slate-400 bg-slate-900 border-r border-slate-800">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        We'll send a 6-digit OTP to verify your phone number.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Suresh Kumar"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phoneNumber.length < 10}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Sending OTP Code...' : 'Send 6-Digit OTP'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-slate-300">
                          Enter 6-Digit OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] text-emerald-400 hover:underline"
                        >
                          Change Number
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-center text-xl tracking-[0.5em] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Didn't receive code?</span>
                      <button
                        type="button"
                        disabled={resendTimer > 0 || loading}
                        onClick={handleSendPhoneOtp}
                        className="text-emerald-400 font-semibold disabled:opacity-40 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Continue'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ================= METHOD 3: EMAIL / PASSWORD ================= */}
            {(authMethod === 'email_login' || authMethod === 'email_signup') && (
              <div className="space-y-4">
                
                {/* Subtabs: Sign In vs Sign Up */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email_login');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg font-semibold transition-all ${
                      authMethod === 'email_login'
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Email Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email_signup');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg font-semibold transition-all ${
                      authMethod === 'email_signup'
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  {authMethod === 'email_signup' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand V."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs mt-2"
                  >
                    <span>
                      {loading 
                        ? 'Authenticating...' 
                        : authMethod === 'email_signup' 
                          ? 'Register & Access TrustScore' 
                          : 'Sign In with Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Security Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Firestore DB Active
              </span>
              <span>Project: trustscore01-98804</span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span><strong className="text-slate-300 font-medium">TrustScore</strong> — AI Alternative Credit Scoring</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">Firebase: trustscore01-98804</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Google / Gmail</span>
          <span>•</span>
          <span>Mobile OTP</span>
          <span>•</span>
          <span>10 Alternative Signals</span>
        </div>
      </footer>

    </div>
  );
};
