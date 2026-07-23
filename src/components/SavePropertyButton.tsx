'use client';

import React, { useState } from 'react';
import { toggleSavedPropertyAction } from '@/actions/buyer';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SavePropertyButton({ propertyId, initialIsSaved = false }: { propertyId: string, initialIsSaved?: boolean }) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const { data: session } = useSession();
  const user = session?.user as any;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      signIn('google', { callbackUrl: window.location.href });
      return;
    }

    const previousState = isSaved;
    setIsSaved(!previousState); // Optimistic UI update

    const res = await toggleSavedPropertyAction(user.id, propertyId);
    if (!res.success) {
      setIsSaved(previousState); // Rollback on failure
    }
  };

  return (
    <>
      <motion.button 
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isSaved ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'background 0.2s, opacity 0.2s',
        }}
        title={isSaved ? "Remove from Saved" : "Save Property"}
      >
        <svg 
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          fill={isSaved ? "#ef4444" : "none"} 
          stroke={isSaved ? "#ef4444" : "#475569"} 
          strokeWidth="2"
          style={{ transition: 'all 0.2s' }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </motion.button>
    </>
  );
}
