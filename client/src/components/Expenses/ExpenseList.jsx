import React from 'react'
import { format } from 'date-fns'
import { Edit2, Trash2 } from 'lucide-react'

const ExpenseList = ({ expenses, onEdit, onDelete, loading }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      Bills: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Healthcare: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      Education: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      Travel: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
    return colors[category] || colors.Other
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="flex justify-center py-8">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-content p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-xs truncate" title={expense.description}>
                      {expense.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpenseList