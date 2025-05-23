import { createContext, useContext, useState, ReactNode } from 'react';
import { FeeRates, TransactionVolumes, ComparisonResult } from '../types';
import { calculateComparison } from '../utils/calculations';

const initialFeeRates: FeeRates = {
  debit: 0,
  credit: 0,
  pix: 0,
  installments: {},
  installment: 0
};

const initialVolumes: TransactionVolumes = {
  debit: 0,
  credit: 0,
  pix: 0,
  installments: {},
  installment: 0
};

interface CalculatorContextType {
  currentRates: FeeRates;
  setCurrentRates: (rates: FeeRates) => void;
  newRates: FeeRates;
  setNewRates: (rates: FeeRates) => void;
  volumes: TransactionVolumes;
  setVolumes: (volumes: TransactionVolumes) => void;
  result: ComparisonResult | null;
  isCalculating: boolean;
  calculateResult: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [currentRates, setCurrentRates] = useState<FeeRates>(initialFeeRates);
  const [newRates, setNewRates] = useState<FeeRates>(initialFeeRates);
  const [volumes, setVolumes] = useState<TransactionVolumes>(initialVolumes);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateResult = () => {
    setIsCalculating(true);
    console.log('Calculando resultado...', { currentRates, newRates, volumes });
    const calculatedResult = calculateComparison(currentRates, newRates, volumes);
    console.log('Resultado calculado:', calculatedResult);
    setResult(calculatedResult);
    setIsCalculating(false);
  };

  const value = {
    currentRates,
    setCurrentRates,
    newRates,
    setNewRates,
    volumes,
    setVolumes,
    result,
    isCalculating,
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
