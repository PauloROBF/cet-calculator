import { useState } from 'react';
import type { FC } from 'react';
import { Save, Trash2, Download, Upload, Moon, Sun, Database } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  onClearHistory: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
}

export function Settings({ onClearHistory, onExportData, onImportData }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [currency, setCurrency] = useState('BRL');
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [autoSave, setAutoSave] = useState(true);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onImportData(content);
      };
      reader.readAsText(file);
    }
  };

  const SettingSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/80 backdrop-blur rounded-xl p-4 sm:p-6 shadow-md border border-emerald-100 dark:bg-emerald-900/80 dark:border-emerald-800">
      <h4 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h2>
      
      <div className="space-y-4">
        <button
          onClick={onClearHistory}
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
        >
          Limpar Histórico
        </button>
        
        <button
          onClick={onExportData}
          className="w-full px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20"
        >
          Exportar Dados
        </button>
        
        <div>
          <label
            htmlFor="importFile"
            className="block w-full px-4 py-2 text-center text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20"
          >
            Importar Dados
          </label>
          <input
            type="file"
            id="importFile"
            className="hidden"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const jsonData = event.target?.result as string;
                  onImportData(jsonData);
                };
                reader.readAsText(file);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 