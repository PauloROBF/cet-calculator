import { FC } from 'react';
import { Download, Share2, TrendingDown, TrendingUp } from 'lucide-react';
import { ComparisonResult } from '../types';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface ResultSummaryProps {
  result: ComparisonResult;
}

export const ResultSummary: FC<ResultSummaryProps> = ({ result }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Comparação de Taxas', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Economia Total: R$ ${result.savings.toFixed(2)}`, 20, 40);
    doc.text(`Percentual de Economia: ${result.savingsPercentage.toFixed(2)}%`, 20, 50);
    
    doc.save('comparacao-taxas.pdf');
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ['Tipo', 'Taxa Atual', 'Taxa Nova', 'Economia'],
      ['Débito', result.breakdown.debit.current, result.breakdown.debit.new, result.breakdown.debit.savings],
      ['Crédito à Vista', result.breakdown.credit.current, result.breakdown.credit.new, result.breakdown.credit.savings],
      ['PIX', result.breakdown.pix.current, result.breakdown.pix.new, result.breakdown.pix.savings],
    ];

    // Adicionar linhas para cada parcela
    Object.entries(result.breakdown.installments).forEach(([installments, values]) => {
      data.push([
        `Crédito ${installments}x`,
        values.current,
        values.new,
        values.savings
      ]);
    });

    // Adicionar total
    data.push(['Total', result.currentTotal, result.newTotal, result.savings]);
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Comparação');
    XLSX.writeFile(wb, 'comparacao-taxas.xlsx');
  };

  const shareResults = async () => {
    const text = `Comparação de Taxas:\n` +
      `Economia Total: R$ ${result.savings.toFixed(2)}\n` +
      `Percentual de Economia: ${result.savingsPercentage.toFixed(2)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Comparação de Taxas',
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Resultado copiado para a área de transferência!');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800/50">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-emerald-800 dark:text-emerald-200">Resumo da Comparação</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Custo Total Atual</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(result.currentTotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Custo Total Ofertado</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(result.newTotal)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-emerald-800">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Economia Mensal</span>
            <div className="flex items-center gap-1">
              {result.savings > 0 ? (
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-base font-semibold ${
                result.savings > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {formatCurrency(Math.abs(result.savings))}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Detalhamento por Modalidade</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Débito</span>
              <div className="flex items-center gap-1">
                {result.savingsByType.debit > 0 ? (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  result.savingsByType.debit > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {formatCurrency(Math.abs(result.savingsByType.debit))}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Crédito à Vista</span>
              <div className="flex items-center gap-1">
                {result.savingsByType.credit > 0 ? (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  result.savingsByType.credit > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {formatCurrency(Math.abs(result.savingsByType.credit))}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">PIX</span>
              <div className="flex items-center gap-1">
                {result.savingsByType.pix > 0 ? (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  result.savingsByType.pix > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {formatCurrency(Math.abs(result.savingsByType.pix))}
                </span>
              </div>
            </div>

            {Object.entries(result.savingsByType.installments).map(([installment, saving]) => (
              <div key={installment} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Parcelado {installment}x</span>
                <div className="flex items-center gap-1">
                  {saving > 0 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    saving > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(Math.abs(saving))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Economia Percentual</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
            <div className="flex items-center gap-1">
              {result.savingsPercentage > 0 ? (
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                result.savingsPercentage > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {formatPercentage(Math.abs(result.savingsPercentage))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Download size={20} />
          PDF
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Download size={20} />
          Excel
        </button>
        <button
          onClick={shareResults}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Share2 size={20} />
          Compartilhar
        </button>
      </div>
    </div>
  );
};