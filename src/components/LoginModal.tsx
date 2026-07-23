'use client';

import React, { useState } from 'react';
import { sendOtpAction } from '@/actions/auth';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
};

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [step, setStep] = useState<'input' | 'otp' | 'google'>('input');
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleClose = () => {
    setMode('login');
    setStep('input');
    setFullName('');
    setPhone('');
    setEmail('');
    setOtp(['', '', '', '']);
    setErrorMessage('');
    onClose();
  };



  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (phone.trim().length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your Full Name to create an account.');
      return;
    }

    setIsOtpLoading(true);
    const res = await sendOtpAction(phone, userRole);
    setIsOtpLoading(false);

    if (res.success) {
      setStep('otp');
    } else {
      setErrorMessage(res.error || 'Failed to send OTP.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4).replace(/\D/g, '');
    if (pasteData) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 4) newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasteData.length, 3);
      const nextInput = document.getElementById(`otp-input-${nextFocus}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const fullCode = otp.join('');
    if (fullCode.length !== 4) {
      setErrorMessage('Please enter the complete 4-digit code.');
      return;
    }

    setIsOtpLoading(true);
    
    // Call Auth.js credentials provider
    const res = await signIn('credentials', {
      redirect: false,
      phone,
      otp: fullCode,
    });
    
    setIsOtpLoading(false);

    if (res && !res.error) {
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        handleClose();
        window.location.reload();
      }, 1200);
    } else {
      setErrorMessage(res?.error || 'Invalid verification code.');
    }
  };

  const handleGoogleAuth = () => {
    setIsGoogleLoading(true);
    signIn('google', { callbackUrl: '/' });
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isSuccess ? (
          <div className="login-success-state">
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3>{mode === 'signup' ? 'Account Created Successfully!' : 'Login Verified!'}</h3>
            <p>Welcome, <strong>{verifiedUser?.name || 'User'}</strong> ({verifiedUser?.phone})</p>
            <span className="auth-role-badge">Verified {verifiedUser?.role === 'seller' ? 'Owner / Agent' : 'Buyer / Tenant'}</span>
          </div>
        ) : (
          <>
            {/* Header branding */}
            <div className="login-modal-header">
              <img src="/assets/images/logo-black.png" alt="Aangan" className="login-logo-img" />
              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                >
                  Log In
                </button>
                <button 
                  className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => { setMode('signup'); setErrorMessage(''); }}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="auth-error-banner">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Switcher (Buyer vs Seller) */}
            <div className="role-switcher">
              <button 
                type="button"
                className={`role-btn ${userRole === 'buyer' ? 'active' : ''}`}
                onClick={() => setUserRole('buyer')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                Buyer / Tenant
              </button>
              <button 
                type="button"
                className={`role-btn ${userRole === 'seller' ? 'active' : ''}`}
                onClick={() => setUserRole('seller')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Owner / Agent
              </button>
            </div>

            {step === 'input' ? (
              <div className="login-step-wrapper">
                <form onSubmit={handleSendOtp} className="login-form">
                  {mode === 'signup' && (
                    <div className="form-group">
                      <label>Full Name <span className="req-star">*</span></label>
                      <input 
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="modal-email-input"
                      />
                    </div>
                  )}

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

                  {mode === 'signup' && (
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
                  )}

                  <button type="submit" disabled={isOtpLoading || isGoogleLoading} className="auth-submit-btn">
                    {isOtpLoading ? 'Sending OTP...' : 'Continue'}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <button 
                  type="button" 
                  disabled={isOtpLoading || isGoogleLoading} 
                  className="google-auth-btn" 
                  onClick={handleGoogleAuth}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="otp-form">
                <div className="otp-header">
                  <h3>Enter OTP Code</h3>
                  <p>A 4-digit code has been sent to <strong>+91 {phone}</strong></p>
                  <div className="dev-otp-hint">Hint for testing: Code is <strong>1234</strong></div>
                  <button type="button" className="btn-change-num" onClick={() => setStep('input')}>Edit Mobile Number</button>
                </div>

                <div className="otp-inputs-grid">
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

                <button type="submit" disabled={isOtpLoading} className="btn-primary btn-block btn-lg mt-3">
                  {isOtpLoading ? 'Verifying...' : 'Verify OTP & Complete'}
                </button>
              </form>
            )}

            <div className="modal-footer-terms">
              <p>By continuing, you agree to Aangan's <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a></p>
            </div>
          </>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
