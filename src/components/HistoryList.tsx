import { FC } from 'react';
import { ComparisonHistory } from '../types';
import { ArrowRight, Download, TrendingDown, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface HistoryListProps {
  history: ComparisonHistory[];
  onSelect: (comparison: ComparisonHistory) => void;
  onClear: () => void;
  onExport: () => void;
  onImport: (jsonData: string) => void;
}

export const HistoryList: FC<HistoryListProps> = ({ history, onSelect, onClear, onExport, onImport }) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Histórico de Comparações</h2>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20"
          >
            Exportar
          </button>
          <label
            className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20"
          >
            Importar
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const jsonData = event.target?.result as string;
                    onImport(jsonData);
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
          <button
            onClick={onClear}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
          >
            Limpar
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Nenhuma comparação realizada ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((comparison) => (
            <button
              key={comparison.id}
              onClick={() => onSelect(comparison)}
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{comparison.date}</p>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    Economia: {comparison.result.totalSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400">
                  Ver detalhes →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};