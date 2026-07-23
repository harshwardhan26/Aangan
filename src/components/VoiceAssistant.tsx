'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { processVoiceCommand } from '@/actions/voice';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const router = useRouter();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        // Setting to mr-IN allows recognition of Marathi, Hindi, and English (with Indian accent)
        recognitionRef.current.lang = 'mr-IN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    // Process when listening stops and we have a transcript
    if (!isListening && isOpen && transcript.trim().length > 0 && !processing) {
      handleProcessCommand(transcript);
    }
  }, [isListening, transcript, isOpen, processing]);

  const handleProcessCommand = async (text: string) => {
    setProcessing(true);
    setAnswer('');
    try {
      const response = await processVoiceCommand(text);
      
      if (response.intent === 'NAVIGATE' && response.navigationTarget) {
        setAnswer('Navigating...');
        setTimeout(() => {
          router.push(response.navigationTarget!);
          setIsOpen(false);
          setTranscript('');
          setAnswer('');
        }, 1500);
      } 
      else if (response.intent === 'SEARCH' && response.searchFilters) {
        setAnswer('Applying filters...');
        const params = new URLSearchParams();
        Object.entries(response.searchFilters).forEach(([key, val]) => {
          if (val) params.set(key, val as string);
        });
        
        setTimeout(() => {
          router.push(`/search?${params.toString()}`);
          setIsOpen(false);
          setTranscript('');
          setAnswer('');
        }, 1500);
      }
      else if (response.intent === 'QUESTION' && response.answerText) {
        setAnswer(response.answerText);
        speakAnswer(response.answerText);
      }
    } catch (error) {
      setAnswer("Sorry, I couldn't understand that.");
    } finally {
      setProcessing(false);
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Attempt to pick an Indian voice for better pronunciation of Marathi/Hindi names
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
      if (indianVoice) utterance.voice = indianVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isOpen) {
      setIsOpen(true);
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (isOpen) {
        setAnswer('');
      }
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Recognition already started
      }
    }
  };

  if (!isSupported) {
    return null; 
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '320px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              padding: '20px',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #f1f5f9'
            }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
            >
              &times;
            </button>
            
            <h3 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: 600 }}>Aangan AI</h3>
            
            <div 
              style={{ 
                minHeight: '80px', 
                width: '100%',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              {isListening && !transcript && (
                <p style={{ color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>Listening (English, Hindi, Marathi)...</p>
              )}
              {transcript && (
                <p style={{ color: '#334155', margin: 0, fontWeight: 500 }}>"{transcript}"</p>
              )}
              {processing && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '4px' }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                </div>
              )}
              {answer && (
                <p style={{ color: 'var(--primary)', margin: '10px 0 0 0', fontWeight: 600 }}>{answer}</p>
              )}
            </div>
            
            <button
              onClick={toggleListening}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isListening ? '#fee2e2' : 'var(--primary)',
                color: isListening ? '#ef4444' : 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: isListening ? 'none' : '0 4px 14px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {isListening ? (
                  <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                ) : (
                  <>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </>
                )}
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
            zIndex: 9998,
          }}
        >
          <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </motion.button>
      )}
    </>
  );
}
