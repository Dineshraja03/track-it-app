
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import Dashboard from '@/components/Dashboard';
import AddTransaction from '@/components/AddTransaction';
import TransactionsList from '@/components/TransactionsList';
import Insights from '@/components/Insights';
import Settings from '@/components/Settings';
import NightModeToggle from '@/components/NightModeToggle';
import { Loader } from '@/components/ui/loader';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [defaultTransactionType, setDefaultTransactionType] = useState<'income' | 'expense' | undefined>(undefined);

  const handleNavigateToAdd = (type: 'income' | 'expense') => {
    setIsLoading(true);
    setDefaultTransactionType(type);
    
    // Add a small delay for smooth animation
    setTimeout(() => {
      setActiveTab('add');
      setIsLoading(false);
    }, 300);
  };

  const handleTransactionSuccess = () => {
    setActiveTab('home');
    setDefaultTransactionType(undefined);
  };

  const renderActiveComponent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard onNavigateToAdd={handleNavigateToAdd} />;
      case 'transactions':
        return <TransactionsList />;
      case 'add':
        return <AddTransaction onSuccess={handleTransactionSuccess} defaultType={defaultTransactionType} />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigateToAdd={handleNavigateToAdd} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-lg transition-colors duration-300">
        {renderActiveComponent()}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-md mx-auto">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Night Mode Toggle */}
      <NightModeToggle />
    </div>
  );
};

export default Index;
