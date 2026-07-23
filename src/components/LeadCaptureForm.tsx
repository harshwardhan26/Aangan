'use client';

import React, { useState, useEffect } from 'react';
import { submitLeadAction } from '@/actions/leads';
import { useSession } from 'next-auth/react';
import LoginModal from './LoginModal';

export default function LeadCaptureForm({ propertyId, sellerId }: { propertyId: string, sellerId: string }) {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const submitLead = async (buyerId?: string) => {
    setLoading(true);
    let clientBudget = null;
    try {
      const storedBudget = localStorage.getItem('aangan_user_budget');
      if (storedBudget) {
        clientBudget = parseInt(storedBudget, 10);
      }
    } catch (e) {}

    const res = await submitLeadAction({
      name,
      phone,
      email,
      propertyId,
      sellerId,
      buyerId: buyerId || user?.id,
      source: 'contact',
      clientBudget: clientBudget && !isNaN(clientBudget) ? clientBudget : null,
    });

    setLoading(false);
    if (res.success) {
      setIsSuccess(true);
    } else {
      alert(res.error || 'Failed to submit request.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === 'unauthenticated' || !user) {
      setShowLoginModal(true);
      return;
    }

    await submitLead();
  };

  if (isSuccess) {
    return (
      <div className="lead-capture-card text-center" style={{ padding: '40px 20px' }}>
        <div style={{ color: '#10b981', marginBottom: '15px' }}>
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 style={{ marginBottom: '10px' }}>Request Received!</h3>
        <p style={{ color: 'var(--text-muted)' }}>Thanks {name}, our expert agent will call you shortly on +91 {phone} to schedule a visit.</p>
        <button className="btn-outline w-100 mt-4" onClick={() => setIsSuccess(false)}>Send Another Request</button>
      </div>
    );
  }

  return (
    <div className="lead-capture-card">
      <h3>Interested in this property?</h3>
      <p>Leave your details and our expert agent will get in touch with you shortly.</p>
      
      <form className="lead-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name <span style={{color:'red'}}>*</span></label>
          <input 
            type="text" 
            id="name" 
            placeholder="E.g. Ramesh Patil" 
            value={name}
            onChange={e => setName(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number <span style={{color:'red'}}>*</span></label>
          <div style={{ display: 'flex' }}>
            <span style={{ 
              background: '#f1f5f9', 
              border: '1px solid var(--border)', 
              borderRight: 'none', 
              padding: '12px 15px', 
              borderRadius: '8px 0 0 8px',
              color: 'var(--text-muted)'
            }}>+91</span>
            <input 
              type="tel" 
              id="phone" 
              placeholder="9876543210" 
              maxLength={10}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              required 
              style={{ borderRadius: '0 8px 8px 0' }}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address <span style={{color:'var(--text-muted)', fontSize: '0.8rem'}}>(Optional)</span></label>
          <input 
            type="email" 
            id="email" 
            placeholder="ramesh@example.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-100 mt-3" style={{ position: 'relative', overflow: 'hidden' }}>
          {loading ? (
             <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
               <svg className="spinner" viewBox="0 0 50 50" width="20" height="20" style={{ animation: 'spin 1s linear infinite' }}>
                 <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round" />
               </svg>
               Submitting...
             </span>
          ) : (
            'Contact Agent Now'
          )}
        </button>
      </form>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={(loggedInUser) => {
          setShowLoginModal(false);
          submitLead(loggedInUser.id);
        }}
      />
    </div>
  );
}
