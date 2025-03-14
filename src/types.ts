export interface FeeRates {
  debit: number;
  credit: number;
  pix: number;
  installments: { [key: number]: number }; // Map of installment number to rate
  installment: number;
}

export interface TransactionVolumes {
  debit: number;
  credit: number;
  pix: number;
  installments: { [key: number]: number }; // Map of installment number to volume
  installment: number;
}

export interface ComparisonResult {
  currentTotal: number;
  newTotal: number;
  savings: number;
  savingsPercentage: number;
  savingsByType: {
    debit: number;
    credit: number;
    pix: number;
    installmentCredit: number;
  };
  breakdown: {
    debit: { current: number; new: number; savings: number };
    credit: { current: number; new: number; savings: number };
    pix: { current: number; new: number; savings: number };
    installments: {
      [key: number]: {
        current: number;
        new: number;
        savings: number;
      };
    };
  };
  difference: number;
  percentageDifference: number;
}

export interface ComparisonHistory {
  id: string;
  date: string;
  currentRates: FeeRates;
  newRates: FeeRates;
  volumes: TransactionVolumes;
  result: ComparisonResult;
}