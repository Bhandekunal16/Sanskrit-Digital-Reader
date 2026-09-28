import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { 
  SanskritDocument, 
  SanskritToken, 
  analyzeSanskritDocument 
} from './sanskrit-analysis';
import { TargetLanguage } from './translation';

export interface SanskritWorkspaceState {
  inputText: string;
  document: SanskritDocument;
  selectedTokenId: string | null;
  selectedToken: SanskritToken | null;
  selectedLineIndex: number;
  targetLanguage: TargetLanguage;
  isProcessing: boolean;
  error: string | null;
  setInputText: (text: string) => void;
  setSelectedTokenId: (id: string | null) => void;
  setSelectedTokenBySurface: (word: string) => void;
  setSelectedLineIndex: (idx: number) => void;
  setTargetLanguage: (lang: TargetLanguage) => void;
  loadSample: (text: string) => void;
  resetWorkspace: () => void;
}

const DEFAULT_WORKSPACE_TEXT = 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।\nपात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम्॥';

const SanskritWorkspaceContext = createContext<SanskritWorkspaceState | undefined>(undefined);

export const SanskritWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputText, setInputTextState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlText = urlParams.get('text');
      if (urlText) return urlText;
    }
    return DEFAULT_WORKSPACE_TEXT;
  });

  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('hindi');
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Compute unified analyzed Sanskrit Document
  const document = useMemo(() => {
    try {
      return analyzeSanskritDocument(inputText);
    } catch (err: any) {
      console.error('Error analyzing Sanskrit document:', err);
      setError(err?.message || 'Failed to analyze Sanskrit document');
      return analyzeSanskritDocument('');
    }
  }, [inputText]);

  // Resolve currently selected token from document
  const selectedToken = useMemo(() => {
    if (!selectedTokenId) {
      // Default to first non-punctuation token if available
      return document.allTokens.find(t => !t.isPunctuation) || null;
    }
    return document.allTokens.find(t => t.id === selectedTokenId) || 
           document.allTokens.find(t => t.clean === selectedTokenId || t.surface === selectedTokenId) || 
           null;
  }, [document, selectedTokenId]);

  // Token selector by surface or clean word
  const setSelectedTokenBySurface = useCallback((word: string) => {
    const clean = word.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim();
    const token = document.allTokens.find(t => t.clean === clean || t.surface === word || t.normalized === clean);
    if (token) {
      setSelectedTokenId(token.id);
    } else {
      setSelectedTokenId(word);
    }
  }, [document]);

  const setInputText = useCallback((text: string) => {
    setIsProcessing(true);
    setInputTextState(text);
    setSelectedTokenId(null);
    setSelectedLineIndex(0);
    setError(null);
    setTimeout(() => setIsProcessing(false), 50);
  }, []);

  const loadSample = useCallback((text: string) => {
    setInputText(text);
  }, [setInputText]);

  const resetWorkspace = useCallback(() => {
    setInputText('');
  }, [setInputText]);

  // Synchronize URL query params gracefully
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (selectedToken && selectedToken.clean) {
        url.searchParams.set('token', selectedToken.clean);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // Ignore URL update errors in sandboxed environments
    }
  }, [selectedToken]);

  const value: SanskritWorkspaceState = {
    inputText,
    document,
    selectedTokenId,
    selectedToken,
    selectedLineIndex,
    targetLanguage,
    isProcessing,
    error,
    setInputText,
    setSelectedTokenId,
    setSelectedTokenBySurface,
    setSelectedLineIndex,
    setTargetLanguage,
    loadSample,
    resetWorkspace
  };

  return (
    <SanskritWorkspaceContext.Provider value={value}>
      {children}
    </SanskritWorkspaceContext.Provider>
  );
};

export function useSanskritWorkspace(): SanskritWorkspaceState {
  const context = useContext(SanskritWorkspaceContext);
  if (!context) {
    throw new Error('useSanskritWorkspace must be used within a SanskritWorkspaceProvider');
  }
  return context;
}
