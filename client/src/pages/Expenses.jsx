import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import ExpenseForm from '../components/Expenses/ExpenseForm'
import ExpenseList from '../components/Expenses/ExpenseList'
import Modal from '../components/UI/Modal'
import { Plus, Filter, Download, Search } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const categories = [
  'All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 
  'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
]

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    search: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    fetchExpenses()
  }, [filters, pagination.currentPage])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10'
      })

      if (filters.category !== 'All') {
        params.append('category', filters.category)
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate)
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate)
      }
      if (filters.search) {
        params.append('search', filters.search)
      }

      const response = await axios.get(`/api/expenses?${params}`)
      setExpenses(response.data.expenses)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post('/api/expenses', expenseData)
      toast.success('Expense added successfully')
      setShowAddModal(false)
      fetchExpenses()
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('Failed to add expense')
    }
  }

  const handleEditExpense = async (expenseData) => {
    try {
      await axios.put(`/api/expenses/${editingExpense._id}`, expenseData)
      toast.success('Expense updated successfully')
      setShowEditModal(false)
      setEditingExpense(null)
      fetchExpenses()
    } catch (error) {
      console.error('Error updating expense:', error)
      toast.error('Failed to update expense')
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await axios.delete(`/api/expenses/${expenseId}`)
      toast.success('Expense deleted successfully')
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowEditModal(true)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }))
  }

  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export')
      return
    }

    const headers = ['Date', 'Description', 'Category', 'Amount']
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        `"${expense.description}"`,
        expense.category,
        expense.amount
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Expenses exported successfully')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary px-4 py-2 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                  placeholder="Search expenses..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="btn-secondary px-4 py-2 flex items-center space-x-2 w-full"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Expense
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${expenses.length > 0 ? (expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Records
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDeleteExpense}
        loading={loading}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingExpense(null)
        }}
        title="Edit Expense"
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleEditExpense}
          onCancel={() => {
            setShowEditModal(false)
            setEditingExpense(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Expenses