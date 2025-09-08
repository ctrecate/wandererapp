import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (formData.password !== formData.confirmPassword) {
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    } catch (error) {
      // Error is handled by the auth context
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const passwordsMatch = formData.password === formData.confirmPassword
  const isFormValid = formData.name && formData.email && formData.password && passwordsMatch

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Start planning amazing trips with your personal travel planner
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <Input
            label="Full name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            autoComplete="name"
            icon={<User className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div>
          <Input
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
            icon={<Mail className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {formData.password && formData.password.length < 6 && (
            <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters</p>
          )}
        </div>

        <div>
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {formData.confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={!isFormValid}
        >
          Create account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:text-blue-700"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export { RegisterForm }
