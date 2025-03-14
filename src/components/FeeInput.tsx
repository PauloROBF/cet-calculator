import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { FeeRates } from '../types';
import { CreditCard, Wallet, Clock, Banknote as Banknotes, Plus, X } from 'lucide-react';

interface FeeInputProps {
  label: string;
  rates: FeeRates;
  onChange: (rates: FeeRates) => void;
}

export const FeeInput: FC<FeeInputProps> = ({ label, rates, onChange }) => {
  const [newInstallment, setNewInstallment] = useState<number>(2);

  const handleChange = (field: keyof FeeRates) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...rates, [field]: value });
  };

  const handleInstallmentChange = (installment: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({
      ...rates,
      installments: {
        ...rates.installments,
        [installment]: value
      }
    });
  };

  const addInstallment = () => {
    if (newInstallment >= 2 && newInstallment <= 12) {
      onChange({
        ...rates,
        installments: {
          ...rates.installments,
          [newInstallment]: 0
        }
      });
      setNewInstallment(2);
    }
  };

  const removeInstallment = (installment: number) => {
    const newInstallments = { ...rates.installments };
    delete newInstallments[installment];
    onChange({
      ...rates,
      installments: newInstallments
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800/50">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-emerald-800 dark:text-emerald-200">{label}</h3>
      <div className="space-y-4 sm:space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Taxa de Débito (%)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={rates.debit}
              onChange={handleChange('debit')}
              className="pl-9 sm:pl-10 block w-full rounded-xl border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-shadow text-sm sm:text-base h-10 sm:h-11 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white dark:focus:ring-emerald-700"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Taxa de Crédito à Vista (%)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={rates.credit}
              onChange={handleChange('credit')}
              className="pl-9 sm:pl-10 block w-full rounded-xl border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-shadow text-sm sm:text-base h-10 sm:h-11 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white dark:focus:ring-emerald-700"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">Taxa de PIX (%)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Banknotes className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={rates.pix}
              onChange={handleChange('pix')}
              className="pl-9 sm:pl-10 block w-full rounded-xl border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-shadow text-sm sm:text-base h-10 sm:h-11 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white dark:focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Taxas de Parcelamento</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min="2"
                max="12"
                value={newInstallment}
                onChange={(e) => setNewInstallment(parseInt(e.target.value) || 2)}
                className="w-16 sm:w-20 rounded-lg border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-sm sm:text-base h-10 sm:h-11 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white dark:focus:ring-emerald-700"
              />
              <button
                onClick={addInstallment}
                className="p-2 sm:p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(rates.installments).map(([installment, rate]) => (
              <div key={installment} className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Taxa {installment}x (%)
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                    </div>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={rate}
                      onChange={handleInstallmentChange(parseInt(installment))}
                      className="pl-9 sm:pl-10 block w-full rounded-xl border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-shadow text-sm sm:text-base h-10 sm:h-11 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white dark:focus:ring-emerald-700"
                    />
                  </div>
                  <button
                    onClick={() => removeInstallment(parseInt(installment))}
                    className="p-2 sm:p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};