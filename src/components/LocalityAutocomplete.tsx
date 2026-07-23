'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getUniqueLocalities } from '@/actions/properties';

export default function LocalityAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = "Search by locality...",
  inputClassName = ""
}: {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (val: string) => void;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  inputClassName?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [originalValue, setOriginalValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen && value !== originalValue) {
      setOriginalValue(value);
    }
  }, [value, isOpen, originalValue]);

  useEffect(() => {
    const fetchLocalities = async () => {
      setIsLoading(true);
      try {
        const results = await getUniqueLocalities(originalValue);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchLocalities, 300);
    return () => clearTimeout(timeoutId);
  }, [originalValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeHighlight = (index: number) => {
    setHighlightedIndex(index);
    if (index >= 0 && index < suggestions.length) {
      onChange(suggestions[index]);
    } else {
      onChange(originalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      // If closed, and user presses Enter, let it bubble up for search
      if (e.key === 'Enter') {
        if (onSelect) onSelect(value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      changeHighlight(highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : highlightedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      changeHighlight(highlightedIndex > -1 ? highlightedIndex - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
        if (onSubmit) onSubmit(suggestions[highlightedIndex]);
      } else {
        // Let it bubble up (e.g. for search submit) if they didn't select a dropdown item
        setIsOpen(false);
        if (onSubmit) onSubmit(value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      changeHighlight(-1);
    }
  };

  const handleSelect = (suggestion: string) => {
    setOriginalValue(suggestion);
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  return (
    <div className="locality-autocomplete" ref={wrapperRef} style={{ flex: 1 }}>
      <input
        type="text"
        className={inputClassName}
        style={{ width: '100%', outline: 'none', background: 'transparent' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setOriginalValue(val);
          onChange(val);
          setHighlightedIndex(-1);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onClick={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
      />
      {isOpen && suggestions.length > 0 && (
        <ul 
          onMouseLeave={() => changeHighlight(-1)}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            listStyle: 'none',
            padding: '8px 0',
            margin: '4px 0 0 0',
            zIndex: 50,
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => changeHighlight(index)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                backgroundColor: highlightedIndex === index ? '#f1f5f9' : 'transparent',
                color: '#1e293b',
                transition: 'background-color 0.2s ease',
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
