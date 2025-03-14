import { FC } from 'react';
import { ComparisonHistory } from '../types';
import { ArrowRight, Download, TrendingDown, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface HistoryListProps {
  history: ComparisonHistory[];
  onSelect: (comparison: ComparisonHistory) => void;
}

export const HistoryList: FC<HistoryListProps> = ({ history, onSelect }) => {
  const exportToPDF = (comparison: ComparisonHistory) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Comparação de Taxas', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Data: ${comparison.date}`, 20, 30);
    doc.text(`Economia Total: R$ ${comparison.result.savings.toFixed(2)}`, 20, 40);
    doc.text(`Percentual de Economia: ${comparison.result.savingsPercentage.toFixed(2)}%`, 20, 50);
    
    doc.save(`comparacao-taxas-${comparison.id}.pdf`);
  };

  const exportToExcel = (comparison: ComparisonHistory) => {
    const wb = XLSX.utils.book_new();
    const data = [
      ['Data da Comparação', comparison.date],
      ['Tipo', 'Taxa Atual', 'Taxa Nova', 'Economia'],
      ['Débito', comparison.result.breakdown.debit.current, comparison.result.breakdown.debit.new, comparison.result.breakdown.debit.savings],
      ['Crédito à Vista', comparison.result.breakdown.credit.current, comparison.result.breakdown.credit.new, comparison.result.breakdown.credit.savings],
      ['PIX', comparison.result.breakdown.pix.current, comparison.result.breakdown.pix.new, comparison.result.breakdown.pix.savings],
      ['Total', comparison.result.currentTotal, comparison.result.newTotal, comparison.result.savings],
    ];
    
    Object.entries(comparison.result.breakdown.installments).forEach(([installment, values]) => {
      data.push([
        `Crédito ${installment}x`,
        values.current,
        values.new,
        values.savings
      ]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Comparação');
    XLSX.writeFile(wb, `comparacao-taxas-${comparison.id}.xlsx`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white/70 backdrop-blur p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800/50">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-emerald-800 dark:text-emerald-200">Histórico de Comparações</h3>
      
      {history.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">Nenhuma comparação realizada ainda.</p>
      ) : (
        <div className="space-y-4">
          {history.map((comparison) => (
            <button
              key={comparison.id}
              onClick={() => onSelect(comparison)}
              className="w-full p-4 bg-white/50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors dark:bg-emerald-800/50 dark:border-emerald-700 dark:hover:border-emerald-600"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{comparison.date}</span>
                <div className="flex items-center gap-1">
                  {comparison.result.savings > 0 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    comparison.result.savings > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(Math.abs(comparison.result.savings))}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Custo Atual</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(comparison.result.currentTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Custo Ofertado</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(comparison.result.newTotal)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};