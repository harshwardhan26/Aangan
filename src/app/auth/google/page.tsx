'use client';

import React from 'react';

export default function GoogleAuthMockPage() {
  const accounts = [
    {
      name: 'Demo Google User',
      email: 'user@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff',
    },
    {
      name: 'Harshwardhan Patil',
      email: 'harshwardhan@aangan.com',
      avatar: 'https://ui-avatars.com/api/?name=Harshwardhan+Patil&background=34A853&color=fff',
    }
  ];

  return (
    <div className="google-oauth-chooser" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="google-chooser-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <svg viewBox="0 0 48 48" width="48" height="48" style={{ margin: '0 auto 15px' }}>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
        <h3 style={{ fontSize: '24px', margin: '0 0 10px', fontWeight: '400' }}>Sign in with Google</h3>
        <p style={{ fontSize: '16px', color: '#5f6368', margin: 0 }}>Choose an account to continue to Aangan</p>
      </div>

      <div className="google-account-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden' }}>
        {accounts.map((acc, i) => (
          <div 
            key={i}
            className="google-account-card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px 20px',
              borderBottom: i === 0 ? '1px solid #dadce0' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => {
              // Save selected user to local storage for parent window to read
              localStorage.setItem('google_auth_mock', JSON.stringify({
                name: acc.name,
                email: acc.email,
              }));
              window.close();
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img 
              src={acc.avatar} 
              alt={acc.name} 
              className="google-avatar"
              style={{ width: '36px', height: '36px', borderRadius: '50%', marginRight: '15px' }}
            />
            <div className="google-account-details">
              <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: '#3c4043' }}>{acc.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#5f6368' }}>{acc.email}</p>
            </div>
          </div>
        ))}

        <div 
          className="google-custom-account-box"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '15px 20px',
            borderTop: '1px solid #dadce0',
            cursor: 'pointer'
          }}
          onClick={() => window.close()}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
            </svg>
          </div>
          <h4 style={{ margin: 0, fontSize: '14px', color: '#3c4043', fontWeight: '500' }}>Use another account</h4>
        </div>
      </div>
      
      <p style={{ fontSize: '12px', color: '#5f6368', textAlign: 'center', marginTop: '30px' }}>
        To continue, Google will share your name, email address, and profile picture with Aangan. Before using this app, you can review Aangan's privacy policy and terms of service.
      </p>
    </div>
  );
}
