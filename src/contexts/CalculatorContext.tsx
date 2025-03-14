import { createContext, useContext, useState, ReactNode } from 'react';
import { FeeRates, TransactionVolumes, ComparisonResult } from '../types';
import { calculateComparison } from '../utils/calculations';

interface CalculatorContextType {
  currentRates: FeeRates;
  setCurrentRates: (rates: FeeRates) => void;
  newRates: FeeRates;
  setNewRates: (rates: FeeRates) => void;
  volumes: TransactionVolumes;
  setVolumes: (volumes: TransactionVolumes) => void;
  result: ComparisonResult | null;
  calculateResult: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [currentRates, setCurrentRates] = useState<FeeRates>({
    debit: 0,
    credit: 0,
    installment: 0
  });

  const [newRates, setNewRates] = useState<FeeRates>({
    debit: 0,
    credit: 0,
    installment: 0
  });

  const [volumes, setVolumes] = useState<TransactionVolumes>({
    debit: 0,
    credit: 0,
    installment: 0
  });

  const [result, setResult] = useState<ComparisonResult | null>(null);

  const calculateResult = () => {
    const calculatedResult = calculateComparison(currentRates, newRates, volumes);
    setResult(calculatedResult);
  };

  const value = {
    currentRates,
    setCurrentRates,
    newRates,
    setNewRates,
    volumes,
    setVolumes,
    result,
    calculateResult
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

export default CalculatorContext; 