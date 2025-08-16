import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

// Create Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, name: string) {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2938a672/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signup failed')
    }

    return response.json()
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// API helpers
export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const session = await auth.getSession()
    const accessToken = session.session?.access_token || publicAnonKey

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2938a672${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `Request failed with status ${response.status}`)
    }

    return response.json()
  },

  async getProducts() {
    return this.request('/products')
  },

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  },

  async getOrders() {
    return this.request('/orders')
  },

  async getUserProfile() {
    return this.request('/user/profile')
  },

  async addToWishlist(productId: string) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    })
  },

  async removeFromWishlist(productId: string) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE'
    })
  }
}