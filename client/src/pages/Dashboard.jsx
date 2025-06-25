import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import PieChart from '../components/Charts/PieChart'
import BarChart from '../components/Charts/BarChart'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Target,
  AlertTriangle
} from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [budgetAlert, setBudgetAlert] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch statistics
      const statsResponse = await axios.get('/api/expenses/stats')
      setStats(statsResponse.data)
      
      // Fetch recent expenses
      const expensesResponse = await axios.get('/api/expenses?limit=5')
      setRecentExpenses(expensesResponse.data.expenses)
      
      // Check budget alert
      if (user.monthlyBudget > 0) {
        const currentMonth = new Date()
        const startDate = startOfMonth(currentMonth)
        const endDate = endOfMonth(currentMonth)
        
        const monthlyResponse = await axios.get(`/api/expenses/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        const monthlyTotal = monthlyResponse.data.totalStats.totalAmount
        
        if (monthlyTotal > user.monthlyBudget * 0.8) {
          setBudgetAlert(true)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const currentMonthExpenses = stats?.totalStats?.totalAmount || 0
  const budgetRemaining = user.monthlyBudget - currentMonthExpenses
  const budgetPercentage = user.monthlyBudget > 0 ? (currentMonthExpenses / user.monthlyBudget) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your expense overview for {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Budget Alert */}
      {budgetAlert && user.monthlyBudget > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 animate-bounce-in">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Budget Alert
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                You've spent {budgetPercentage.toFixed(1)}% of your monthly budget. Consider reviewing your expenses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card animate-slide-up">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats?.totalStats?.totalAmount?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Expense
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats?.totalStats?.averageAmount?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalStats?.totalCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Budget Remaining
                </p>
                <p className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${user.monthlyBudget > 0 ? budgetRemaining.toFixed(2) : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.categoryStats && stats.categoryStats.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <PieChart 
              data={stats.categoryStats} 
              title="Expenses by Category" 
            />
          </div>
        )}
        
        {stats?.monthlyStats && stats.monthlyStats.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <BarChart 
              data={stats.monthlyStats.reverse()} 
              title="Monthly Expense Trend" 
            />
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Expenses
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {expense.category} • {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard