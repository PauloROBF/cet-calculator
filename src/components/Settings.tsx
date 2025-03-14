import { useState } from 'react';
import type { FC } from 'react';
import { Save, Trash2, Download, Upload, Moon, Sun, Database } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  onClearHistory: () => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
}

export const Settings: FC<SettingsProps> = ({ onClearHistory, onExportData, onImportData }) => {
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
      <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Configurações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingSection title="Aparência">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</label>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors dark:bg-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-700"
              >
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'light' ? 'Claro' : 'Escuro'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Moeda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Casas Decimais</label>
              <select
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                className="w-full rounded-lg border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white"
              >
                <option value={2}>2 casas (0,00)</option>
                <option value={3}>3 casas (0,000)</option>
                <option value={4}>4 casas (0,0000)</option>
              </select>
            </div>
          </div>
        </SettingSection>

        <SettingSection title="Dados">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Salvamento Automático</label>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSave ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={onExportData}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Download size={18} />
                Exportar Dados
              </button>

              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-700">
                <Upload size={18} />
                Importar Dados
                <input type="file" accept=".json" className="hidden" onChange={handleFileImport} />
              </label>

              <button
                onClick={onClearHistory}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full dark:bg-red-600 dark:hover:bg-red-700"
              >
                <Trash2 size={18} />
                Limpar Histórico
              </button>
            </div>
          </div>
        </SettingSection>

        <SettingSection title="Backup">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Database size={18} />
              <span>Último backup: Hoje às 15:30</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequência de Backup</label>
              <select
                className="w-full rounded-lg border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 dark:bg-emerald-800 dark:border-emerald-700 dark:text-white"
                defaultValue="daily"
              >
                <option value="manual">Manual</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
        </SettingSection>

        <SettingSection title="Sobre">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p className="font-medium">CET Calculator</p>
              <p>Versão 1.0.0</p>
            </div>
            <div>
              <p className="font-medium">Desenvolvido por</p>
              <p>Sua Empresa</p>
            </div>
            <div>
              <p className="font-medium">Contato</p>
              <p>suporte@suaempresa.com.br</p>
            </div>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}; 