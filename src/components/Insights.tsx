
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { getCategoryById } from '@/data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Insights = () => {
  const { transactions, getCategoryTotals } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for pie chart
  const categoryTotals = getCategoryTotals();
  const pieData = Object.entries(categoryTotals)
    .map(([categoryId, total]) => {
      const category = getCategoryById(categoryId);
      return {
        name: category?.name || categoryId,
        value: total,
        color: category?.color || '#6B7280',
        icon: category?.icon || '💳',
      };
    })
    .sort((a, b) => b.value - a.value);

  // Calculate totals
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Prepare monthly data
  const monthlyData = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
    
    const monthlyIncome = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'income' && 
               tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && 
               tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month: monthName,
      income: monthlyIncome,
      expense: monthlyExpense,
    });
  }

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Insights 📊</h1>
        <p className="text-gray-600 mt-1">Understand your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-lg font-bold text-rupee-green">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">💸</div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {pieData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category List */}
            <div className="space-y-2">
              {pieData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.icon} {item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends */}
      {monthlyData.some(d => d.income > 0 || d.expense > 0) && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'income' ? 'Income' : 'Expense'
                    ]}
                  />
                  <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expense" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-gray-600">Add some transactions to see your insights!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Insights;
