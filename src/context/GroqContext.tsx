import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { listModels, GroqModel } from '../lib/groq';

interface GroqContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  models: GroqModel[];
  modelsLoading: boolean;
  modelsError: string | null;
  refreshModels: () => Promise<void>;
}

const GroqContext = createContext<GroqContextType>({
  apiKey: '',
  setApiKey: () => {},
  isKeySet: false,
  models: [],
  modelsLoading: false,
  modelsError: null,
  refreshModels: async () => {},
});

export const useGroq = () => useContext(GroqContext);

export const GroqProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('groq_api_key') || '';
  });
  const [models, setModels] = useState<GroqModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('groq_api_key', key);
    } else {
      localStorage.removeItem('groq_api_key');
    }
  };

  const refreshModels = async () => {
    if (!apiKey) return;
    setModelsLoading(true);
    setModelsError(null);
    try {
      const data = await listModels(apiKey);
      // Sort: active first, then by id
      const sorted = data
        .filter((m) => m.active !== false)
        .sort((a, b) => a.id.localeCompare(b.id));
      setModels(sorted);
    } catch (err: any) {
      setModelsError(err.message || 'Failed to load models');
      setModels([]);
    } finally {
      setModelsLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      refreshModels();
    } else {
      setModels([]);
    }
  }, [apiKey]);

  return (
    <GroqContext.Provider
      value={{
        apiKey,
        setApiKey,
        isKeySet: apiKey.length > 0,
        models,
        modelsLoading,
        modelsError,
        refreshModels,
      }}
    >
      {children}
    </GroqContext.Provider>
  );
};

