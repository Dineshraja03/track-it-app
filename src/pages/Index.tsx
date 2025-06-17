
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import Dashboard from '@/components/Dashboard';
import AddTransaction from '@/components/AddTransaction';
import TransactionsList from '@/components/TransactionsList';
import Insights from '@/components/Insights';
import Settings from '@/components/Settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsList />;
      case 'add':
        return <AddTransaction onSuccess={() => setActiveTab('home')} />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {renderActiveComponent()}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-md mx-auto">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
