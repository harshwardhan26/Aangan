'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { firebaseAuth } from '@/lib/firebase-client';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
};

// Map Firebase auth error codes to user-friendly messages
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Invalid phone number. Please check and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/code-expired':
      return 'OTP has expired. Please request a new one.';
    case 'auth/invalid-verification-code':
      return 'Incorrect OTP. Please double-check the code sent to your phone.';
    case 'auth/missing-verification-code':
      return 'Please enter the 6-digit OTP.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please refresh and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [step, setStep] = useState<'input' | 'otp' | 'profile'>('input');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // 6 boxes for Firebase's 6-digit OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Clean up reCAPTCHA when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanupRecaptcha();
    }
  }, [isOpen]);

  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try { recaptchaVerifierRef.current.clear(); } catch (_) {}
      recaptchaVerifierRef.current = null;
    }
    // Also wipe the DOM node so reCAPTCHA can be freshly mounted next time
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';
  };


  const handleClose = () => {
    cleanupRecaptcha();
    setStep('input');
    setFullName('');
    setPhone('');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    setResendCountdown(0);
    onClose();
  };

  // ── STEP 1: Send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (phone.trim().length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }


    setIsSendingOtp(true);

    try {
      // Create invisible reCAPTCHA — must be rendered into a real DOM node
      cleanupRecaptcha();
      const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      recaptchaVerifierRef.current = verifier;

      const fullPhone = `+91${phone.trim()}`;
      const result = await signInWithPhoneNumber(firebaseAuth, fullPhone, verifier);
      confirmationResultRef.current = result;

      setStep('otp');
      setResendCountdown(60);
    } catch (err: any) {
      console.error('[FirebaseAuth] sendOtp error:', err);
      cleanupRecaptcha();
      setErrorMessage(getFirebaseErrorMessage(err.code || ''));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ── STEP 2: Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }
    if (!confirmationResultRef.current) {
      setErrorMessage('Session expired. Please go back and request a new OTP.');
      return;
    }

    setIsVerifying(true);

    try {
      // Confirm the OTP with Firebase — this proves the user owns the phone
      const userCredential = await confirmationResultRef.current.confirm(code);
      const firebaseIdToken = await userCredential.user.getIdToken();

      // Sign in with NextAuth credentials provider — server verifies the token
      const res = await signIn('credentials', {
        redirect: false,
        firebaseToken: firebaseIdToken,
        role: userRole,
      });

      if (res && !res.error) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          handleClose();
          window.location.reload();
        }, 1200);
      } else if (res?.error === 'NEW_USER_NEEDS_PROFILE') {
        // This is a new user without a profile! Let's ask them for it.
        setErrorMessage('');
        setStep('profile');
      } else {
        setErrorMessage(res?.error || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[FirebaseAuth] verifyOtp error:', err);
      setErrorMessage(getFirebaseErrorMessage(err.code || ''));
    } finally {
      setIsVerifying(false);
    }
  };

  // ── STEP 3: Complete Profile ────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsVerifying(true);
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        throw new Error('Firebase user session lost. Please try logging in again.');
      }
      const firebaseIdToken = await currentUser.getIdToken();

      const res = await signIn('credentials', {
        redirect: false,
        firebaseToken: firebaseIdToken,
        role: userRole,
        name: fullName,
        email: email,
      });

      if (res && !res.error) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          handleClose();
          window.location.reload();
        }, 1200);
      } else {
        setErrorMessage(res?.error || 'Profile update failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[ProfileSubmit] error:', err);
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');

    setIsSendingOtp(true);
    try {
      cleanupRecaptcha();
      const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      recaptchaVerifierRef.current = verifier;

      const fullPhone = `+91${phone.trim()}`;
      const result = await signInWithPhoneNumber(firebaseAuth, fullPhone, verifier);
      confirmationResultRef.current = result;
      setResendCountdown(60);
    } catch (err: any) {
      cleanupRecaptcha();
      setErrorMessage(getFirebaseErrorMessage(err.code || ''));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ── OTP input helpers ────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) newOtp[i] = paste[i];
    setOtp(newOtp);
    document.getElementById(`otp-input-${Math.min(paste.length, 5)}`)?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="login-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Invisible reCAPTCHA mount point — must always be in DOM */}
            <div id="recaptcha-container" ref={recaptchaContainerRef} />

            <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {isSuccess ? (
              <div className="login-success-state">
                <div className="success-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Login Verified!</h3>
                <p>Welcome to Aangan!</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="login-modal-header">
                  <img src="/assets/images/logo-black.png" alt="Aangan" className="login-logo-img" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginTop: '0.5rem', marginBottom: 0 }}>
                    Sign in or Create account
                  </h2>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="auth-error-banner">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Role Switcher */}
                <div className="role-switcher">
                  <button
                    type="button"
                    className={`role-btn ${userRole === 'buyer' ? 'active' : ''}`}
                    onClick={() => setUserRole('buyer')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Buyer / Tenant
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${userRole === 'seller' ? 'active' : ''}`}
                    onClick={() => setUserRole('seller')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Owner / Agent
                  </button>
                </div>

                {/* ── STEP 1: Phone input ── */}
                {step === 'input' ? (
                  <div className="login-step-wrapper">
                    <form onSubmit={handleSendOtp} className="login-form">
                      <div className="form-group">
                        <label>Mobile Number <span className="req-star">*</span></label>
                        <div className="phone-input-group">
                          <span className="country-code">+91</span>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="btn-primary w-100"
                        style={{ marginTop: '15px', padding: '14px' }}
                      >
                        {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                      </button>
                    </form>
                  </div>
                ) : step === 'profile' ? (
                  /* ── STEP 3: Complete Profile ── */
                  <div className="login-step-wrapper">
                    <form onSubmit={handleProfileSubmit} className="login-form">
                      <div className="otp-header">
                        <h3>Complete Your Profile</h3>
                        <p>Welcome! Please tell us a bit about yourself.</p>
                      </div>

                      <div className="form-group">
                        <label>Full Name <span className="req-star">*</span></label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="modal-email-input"
                          autoFocus
                        />
                      </div>

                      <div className="form-group mt-2">
                        <label>Email Address <span className="opt-tag">(Optional)</span></label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="modal-email-input"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="btn-primary w-100"
                        style={{ marginTop: '15px', padding: '14px' }}
                      >
                        {isVerifying ? 'Saving...' : 'Continue'}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* ── STEP 2: OTP verification ── */
                  <form onSubmit={handleVerifyOtp} className="otp-form">
                    <div className="otp-header">
                      <h3>Enter OTP Code</h3>
                      <p>
                        A 6-digit code was sent to{' '}
                        <strong>+91 {phone}</strong> via SMS
                      </p>
                      <button
                        type="button"
                        className="btn-change-num"
                        onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); setErrorMessage(''); }}
                      >
                        Edit Mobile Number
                      </button>
                    </div>

                    <div className="otp-inputs-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="otp-digit-input"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="btn-primary w-100"
                      style={{ marginTop: '15px', padding: '14px' }}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify OTP & Continue'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: '#64748b' }}>
                      {resendCountdown > 0 ? (
                        <span>Resend OTP in {resendCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSendingOtp}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: '0.9rem' }}
                        >
                          {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                        </button>
                      )}
                    </div>
                  </form>
                )}

                <div className="modal-footer-terms">
                  <p>By continuing, you agree to Aangan's <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a></p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
