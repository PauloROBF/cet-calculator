import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, TrendingUp, Home, History, Settings as SettingsIcon, Menu, X, LogOut } from 'lucide-react';
import { FeeInput } from './components/FeeInput';
import { VolumeInput } from './components/VolumeInput';
import { ComparisonChart } from './components/ComparisonChart';
import { ResultSummary } from './components/ResultSummary';
import { HistoryList } from './components/HistoryList';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { calculateComparison } from './utils/calculations';
import { FeeRates, TransactionVolumes, ComparisonResult, ComparisonHistory } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CalculatorProvider } from './contexts/CalculatorContext';

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

function MainContent() {
  const { currentUser, signOut } = useAuth();
  const [currentRates, setCurrentRates] = useState<FeeRates>(initialFeeRates);
  const [newRates, setNewRates] = useState<FeeRates>(initialFeeRates);
  const [volumes, setVolumes] = useState<TransactionVolumes>(initialVolumes);
  const [showResults, setShowResults] = useState(false);
  const [activePage, setActivePage] = useState('calculator');
  const [history, setHistory] = useState<ComparisonHistory[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonHistory | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  
  const result: ComparisonResult = calculateComparison(currentRates, newRates, volumes);

  useEffect(() => {
    if (currentUser) {
      const savedHistory = localStorage.getItem('comparisonHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [currentUser]);

  const handleAnalyze = () => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }

    const newComparison: ComparisonHistory = {
      id: uuidv4(),
      date: new Date().toLocaleString(),
      currentRates,
      newRates,
      volumes,
      result,
    };

    const updatedHistory = [newComparison, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('comparisonHistory', JSON.stringify(updatedHistory));
    
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowResults(false);
    setSelectedComparison(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistorySelect = (comparison: ComparisonHistory) => {
    setSelectedComparison(comparison);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('comparisonHistory');
  };

  const handleExportData = () => {
    const data = {
      history,
      currentRates,
      newRates,
      volumes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cet-calculator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.history) {
        setHistory(data.history);
        localStorage.setItem('comparisonHistory', JSON.stringify(data.history));
      }
      if (data.currentRates) setCurrentRates(data.currentRates);
      if (data.newRates) setNewRates(data.newRates);
      if (data.volumes) setVolumes(data.volumes);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const NavLink = ({ icon: Icon, label, page }: { icon: any, label: string, page: string }) => (
    <button
      onClick={() => {
        if (!currentUser && (page === 'history' || page === 'settings')) {
          setShowAuth(true);
          return;
        }
        setActivePage(page);
        setShowResults(false);
        setSelectedComparison(null);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 w-full ${
        activePage === page
          ? 'bg-emerald-500 text-white'
          : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-800/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-900 dark:to-teal-950 dark:text-white">
      {showAuth && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-md mx-4">
            {isLogin ? (
              <Login onToggleMode={toggleMode} onClose={() => setShowAuth(false)} />
            ) : (
              <SignUp onToggleMode={toggleMode} onClose={() => setShowAuth(false)} />
            )}
          </div>
        </div>
      )}

      <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-10 border-b border-emerald-100 dark:bg-emerald-900/70 dark:border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 dark:from-emerald-300 dark:to-green-300 bg-clip-text text-transparent">
                  CET Calculator
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-2">
                <NavLink icon={Home} label="Calculadora" page="calculator" />
                <NavLink icon={History} label="Histórico" page="history" />
                <NavLink icon={SettingsIcon} label="Configurações" page="settings" />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <button
                  onClick={signOut}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="hidden md:flex items-center gap-2 px-6 py-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-800/50 transition-all duration-300"
                >
                  <span className="font-medium">Entrar</span>
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 dark:border-emerald-800">
            <div className="px-4 py-2 space-y-1">
              <NavLink icon={Home} label="Calculadora" page="calculator" />
              <NavLink icon={History} label="Histórico" page="history" />
              <NavLink icon={SettingsIcon} label="Configurações" page="settings" />
              {currentUser ? (
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-6 py-2 w-full text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-800/50 transition-all duration-300"
                >
                  <span className="font-medium">Entrar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'calculator' && !showResults ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FeeInput
                label="Taxas Atuais"
                rates={currentRates}
                onChange={setCurrentRates}
              />
              <FeeInput
                label="Taxas Ofertadas"
                rates={newRates}
                onChange={setNewRates}
              />
            </div>
            
            <div>
              <VolumeInput
                volumes={volumes}
                onChange={setVolumes}
              />
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleAnalyze}
                className="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base md:text-lg font-semibold w-full md:w-auto justify-center dark:from-emerald-600 dark:to-green-600 dark:hover:from-emerald-700 dark:hover:to-green-700"
              >
                <TrendingUp size={24} className="transition-transform group-hover:scale-110" />
                Analisar Comparativo
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ) : activePage === 'calculator' && showResults ? (
          <div className="space-y-6 md:space-y-8">
            <button
              onClick={handleBack}
              className="mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ArrowRight size={20} className="rotate-180" />
              Voltar para Edição
            </button>

            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
              <ResultSummary result={result} />
              <ComparisonChart result={result} />
            </div>
          </div>
        ) : activePage === 'history' ? (
          <HistoryList
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
            onExport={handleExportData}
            onImport={handleImportData}
          />
        ) : (
          <Settings
            onClearHistory={handleClearHistory}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CalculatorProvider>
          <MainContent />
        </CalculatorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;