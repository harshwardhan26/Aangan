'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { processVoiceCommand } from '@/actions/voice';

type Message = { role: 'user' | 'assistant', content: string };

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Aangan AI. How can I help you today?' }
  ]);
  const [isSupported, setIsSupported] = useState(false);
  
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, processing, transcript]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
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
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error("Speech recognition error", event.error);
          }
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!isListening && isOpen && transcript.trim().length > 0 && !processing) {
      const textToProcess = transcript.trim();
      setTranscript(''); 
      handleUserSubmit(textToProcess);
    }
  }, [isListening, transcript, isOpen, processing]);

  const handleUserSubmit = async (text: string) => {
    if (!text.trim() || processing) return;
    
    const historyToPass = [...messages];
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
    setProcessing(true);

    try {
      const response = await processVoiceCommand(text, historyToPass);
      
      let aiResponseText = "";

      if (response.intent === 'NAVIGATE' && response.navigationTarget) {
        aiResponseText = `Navigating to ${response.navigationTarget}...`;
        setTimeout(() => {
          router.push(response.navigationTarget!);
          setIsOpen(false);
        }, 1500);
      } 
      else if (response.intent === 'SEARCH' && response.searchFilters) {
        aiResponseText = 'Applying filters and searching...';
        const params = new URLSearchParams();
        Object.entries(response.searchFilters).forEach(([key, val]) => {
          if (val) params.set(key, val as string);
        });
        
        setTimeout(() => {
          router.push(`/search?${params.toString()}`);
          setIsOpen(false);
        }, 1500);
      }
      else if (response.intent === 'QUESTION' && response.answerText) {
        aiResponseText = response.answerText;
        speakAnswer(response.answerText);
      } else {
        aiResponseText = "I processed your request, but I'm not sure what to do next.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setProcessing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserSubmit(inputText.trim());
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
      if (indianVoice) utterance.voice = indianVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };

  if (!isSupported) {
    return null; 
  }

  const showActiveMicrophone = isOpen && isListening;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '360px',
              height: '520px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.6)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px 16px',
              background: 'transparent',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Aangan AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b', lineHeight: 1, padding: 0 }}
              >
                &times;
              </button>
            </div>
            
            {/* Chat Body */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'transparent'
            }}>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, #be123c 100%)' : 'rgba(255, 255, 255, 0.9)',
                    color: msg.role === 'user' ? 'white' : '#334155',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                    maxWidth: '85%',
                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(225, 29, 72, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.05)',
                    border: msg.role === 'assistant' ? '1px solid rgba(255, 255, 255, 0.8)' : 'none',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}
                >
                  {msg.content}
                </motion.div>
              ))}

              {isListening && transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: 'flex-end',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #be123c 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    borderBottomRightRadius: '4px',
                    maxWidth: '85%',
                    opacity: 0.7,
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}
                >
                  {transcript}
                </motion.div>
              )}

              {processing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '16px',
                    borderRadius: '18px',
                    borderBottomLeftRadius: '4px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    gap: '6px'
                  }}
                >
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Footer / Input Area */}
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <form onSubmit={handleTextSubmit} style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '24px',
                padding: '6px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid rgba(255, 255, 255, 0.6)'
              }}>
                <button
                  type="button"
                  onClick={toggleListening}
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: isListening ? '#ffe4e6' : 'transparent',
                    color: isListening ? '#e11d48' : '#64748b',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke={isListening ? '#e11d48' : '#64748b'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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

                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Aangan AI..."
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#334155'
                  }}
                />

                <button 
                  type="submit"
                  disabled={!inputText.trim() || processing}
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: inputText.trim() && !processing ? 'var(--primary)' : 'transparent',
                    color: inputText.trim() && !processing ? 'white' : '#94a3b8',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: inputText.trim() && !processing ? 'pointer' : 'default',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke={inputText.trim() && !processing ? 'white' : '#94a3b8'} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(1px)' }}>
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary) 0%, #be123c 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(225, 29, 72, 0.4)',
            zIndex: 9998,
          }}
        >
          <svg viewBox="0 0 24 24" width="30" height="30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </motion.button>
      )}
    </>
  );
}
