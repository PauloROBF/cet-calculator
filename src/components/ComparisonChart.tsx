import { FC } from 'react';
import { ComparisonResult } from '../types';

interface ComparisonChartProps {
  result: ComparisonResult;
}

export const ComparisonChart: FC<ComparisonChartProps> = ({ result }) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

  return (
    <div className="bg-white/70 backdrop-blur p-8 rounded-2xl shadow-xl border border-emerald-100/50 dark:bg-gray-800/70 dark:border-gray-700/50">
      <h3 className="text-xl font-semibold mb-6 text-emerald-800 dark:text-emerald-400">Comparação de Custos</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Débito</span>
          <div className="space-x-4">
            <span className="text-red-500">{formatCurrency(result.breakdown.debit.current)}</span>
            <span className="text-emerald-500">{formatCurrency(result.breakdown.debit.new)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Crédito à Vista</span>
          <div className="space-x-4">
            <span className="text-red-500">{formatCurrency(result.breakdown.credit.current)}</span>
            <span className="text-emerald-500">{formatCurrency(result.breakdown.credit.new)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>PIX</span>
          <div className="space-x-4">
            <span className="text-red-500">{formatCurrency(result.breakdown.pix.current)}</span>
            <span className="text-emerald-500">{formatCurrency(result.breakdown.pix.new)}</span>
          </div>
        </div>
        {Object.entries(result.breakdown.installments).map(([installment, values]) => (
          <div key={installment} className="flex justify-between items-center">
            <span>Crédito {installment}x</span>
            <div className="space-x-4">
              <span className="text-red-500">{formatCurrency(values.current)}</span>
              <span className="text-emerald-500">{formatCurrency(values.new)}</span>
            </div>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-emerald-100/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <div className="space-x-4">
              <span className="text-red-500">{formatCurrency(result.currentTotal)}</span>
              <span className="text-emerald-500">{formatCurrency(result.newTotal)}</span>
            </div>
          </div>
          <div className="text-right mt-2">
            <span className="text-emerald-500">
              Economia: {formatCurrency(result.savings)} ({result.savingsPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};