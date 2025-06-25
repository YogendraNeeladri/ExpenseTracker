import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { User, DollarSign, Save } from 'lucide-react'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    monthlyBudget: user?.monthlyBudget || 0
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyBudget' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (formData.monthlyBudget < 0) {
      toast.error('Budget cannot be negative')
      return
    }

    setLoading(true)
    try {
      const response = await axios.put('/api/users/profile', formData)
      updateUser(response.data.user)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                className="input bg-gray-50 dark:bg-gray-700"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Monthly Budget
              </label>
              <input
                type="number"
                id="monthlyBudget"
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Set your monthly spending limit to get budget alerts
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Statistics
          </h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Member Since
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Budget
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formData.monthlyBudget.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile