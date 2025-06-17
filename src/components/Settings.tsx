
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2 } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    const transactions = localStorage.getItem('rupee-sahayak-transactions');
    if (!transactions) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(JSON.parse(transactions), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `track-it-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      localStorage.removeItem('rupee-sahayak-transactions');
      toast({
        title: "Data Cleared",
        description: "All transactions have been deleted",
      });
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings ⚙️</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Customize your experience</p>
      </div>

      {/* Data Management */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleExportData}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2" size={16} />
              Export Data (JSON)
            </Button>

            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="mr-2" size={16} />
              Clear All Data
            </Button>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Backup Reminder:</strong> Your data is stored locally on this device. 
              Export regularly to avoid losing your transaction history.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-4">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Track It</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your Smart Expense Manager</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Version 1.0.0</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Free</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Forever</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Offline</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">No Internet</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">Private</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Local Storage</p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p>Made with ❤️ for Indian users</p>
            <p>No login required • Works offline • Privacy first</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
