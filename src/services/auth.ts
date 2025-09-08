import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth'

// Simple in-memory user storage (in a real app, this would be a database)
const USERS_KEY = 'travel_app_users'
const CURRENT_USER_KEY = 'travel_app_current_user'

// Simple password hashing (in production, use proper hashing like bcrypt)
function hashPassword(password: string): string {
  return btoa(password + 'travel_app_salt')
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function getStoredUsers(): Record<string, User & { passwordHash: string }> {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function storeUser(user: User & { passwordHash: string }): void {
  const users = getStoredUsers()
  users[user.id] = user
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (!stored) return null
    
    const userData = JSON.parse(stored)
    return {
      ...userData,
      createdAt: new Date(userData.createdAt),
      lastLoginAt: new Date(userData.lastLoginAt)
    }
  } catch {
    return null
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const { email, password } = credentials
  
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required')
  }
  
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address')
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  
  // Find user
  const users = getStoredUsers()
  const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    throw new Error('No account found with this email address')
  }
  
  // Verify password
  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('Incorrect password')
  }
  
  // Update last login
  const updatedUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    lastLoginAt: new Date()
  }
  
  // Store updated user
  storeUser({ ...user, lastLoginAt: updatedUser.lastLoginAt })
  setCurrentUser(updatedUser)
  
  return updatedUser
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  const { email, password, name } = credentials
  
  // Validate input
  if (!email || !password || !name) {
    throw new Error('All fields are required')
  }
  
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address')
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  
  if (name.length < 2) {
    throw new Error('Name must be at least 2 characters')
  }
  
  // Check if user already exists
  const users = getStoredUsers()
  const existingUser = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (existingUser) {
    throw new Error('An account with this email already exists')
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name: name.trim(),
    createdAt: new Date(),
    lastLoginAt: new Date()
  }
  
  const userWithPassword = {
    ...newUser,
    passwordHash: hashPassword(password)
  }
  
  // Store user
  storeUser(userWithPassword)
  setCurrentUser(newUser)
  
  return newUser
}

export function logout(): void {
  clearCurrentUser()
}

export function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
