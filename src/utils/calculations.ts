import { FeeRates, TransactionVolumes, ComparisonResult } from '../types';

export const calculateComparison = (
  currentRates: FeeRates,
  newRates: FeeRates,
  volumes: TransactionVolumes
): ComparisonResult => {
  // Calculate costs for each payment method
  const debitCurrent = (volumes.debit * currentRates.debit) / 100;
  const debitNew = (volumes.debit * newRates.debit) / 100;
  
  const creditCurrent = (volumes.credit * currentRates.credit) / 100;
  const creditNew = (volumes.credit * newRates.credit) / 100;
  
  const pixCurrent = (volumes.pix * currentRates.pix) / 100;
  const pixNew = (volumes.pix * newRates.pix) / 100;

  // Calculate installment costs
  const installmentBreakdown: { [key: number]: { current: number; new: number; savings: number } } = {};
  let totalInstallmentCurrent = 0;
  let totalInstallmentNew = 0;

  Object.entries(volumes.installments).forEach(([installment, volume]) => {
    const numInstallment = parseInt(installment);
    const currentRate = currentRates.installments[numInstallment] || 0;
    const newRate = newRates.installments[numInstallment] || 0;
    
    const current = (volume * currentRate * numInstallment) / 100;
    const newCost = (volume * newRate * numInstallment) / 100;
    
    totalInstallmentCurrent += current;
    totalInstallmentNew += newCost;
    
    installmentBreakdown[numInstallment] = {
      current,
      new: newCost,
      savings: current - newCost
    };
  });

  // Calculate totals
  const currentTotal = debitCurrent + creditCurrent + pixCurrent + totalInstallmentCurrent;
  const newTotal = debitNew + creditNew + pixNew + totalInstallmentNew;
  
  // Calculate savings
  const savings = currentTotal - newTotal;
  const savingsPercentage = currentTotal > 0 ? (savings / currentTotal) * 100 : 0;

  return {
    currentTotal,
    newTotal,
    savings,
    savingsPercentage,
    breakdown: {
      debit: {
        current: debitCurrent,
        new: debitNew,
        savings: debitCurrent - debitNew,
      },
      credit: {
        current: creditCurrent,
        new: creditNew,
        savings: creditCurrent - creditNew,
      },
      pix: {
        current: pixCurrent,
        new: pixNew,
        savings: pixCurrent - pixNew,
      },
      installments: installmentBreakdown,
    },
  };
};