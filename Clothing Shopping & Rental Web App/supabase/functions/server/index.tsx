import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Auth middleware for protected routes
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return c.json({ error: 'No access token provided' }, 401)
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    return c.json({ error: 'Invalid access token' }, 401)
  }

  c.set('user', user)
  await next()
}

// User signup
app.post('/make-server-2938a672/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm since no email server is configured
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      wishlist: [],
      orders: []
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// Get user profile
app.get('/make-server-2938a672/user/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const profile = await kv.get(`user:${user.id}`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Get products with availability
app.get('/make-server-2938a672/products', async (c) => {
  try {
    const products = await kv.get('products')
    
    if (!products) {
      // Initialize with sample products if none exist
      const sampleProducts = [
        {
          id: '1',
          name: 'Elegant Summer Dress',
          brand: 'Zara',
          image: 'https://images.unsplash.com/photo-1632773003373-6645a802c154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU1MzEwMjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 89,
          rentPrice: 25,
          category: 'Dresses',
          sizes: ['XS', 'S', 'M', 'L'],
          isNew: true,
          availability: {
            buy: { XS: 5, S: 8, M: 10, L: 6 },
            rent: { XS: 2, S: 3, M: 4, L: 2 }
          }
        },
        {
          id: '2',
          name: 'Designer Evening Gown',
          brand: 'Gucci',
          image: 'https://images.unsplash.com/photo-1610047402714-307d99a677db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTUyOTIyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 450,
          rentPrice: 89,
          category: 'Dresses',
          sizes: ['S', 'M', 'L'],
          isOnSale: true,
          availability: {
            buy: { S: 2, M: 3, L: 1 },
            rent: { S: 1, M: 2, L: 1 }
          }
        },
        {
          id: '3',
          name: 'Casual Streetwear Set',
          brand: 'Nike',
          image: 'https://images.unsplash.com/photo-1736555142217-916540c7f1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzdHJlZXR3ZWFyJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU1MzEwMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 120,
          rentPrice: 30,
          category: 'Tops',
          sizes: ['S', 'M', 'L', 'XL'],
          availability: {
            buy: { S: 7, M: 12, L: 8, XL: 5 },
            rent: { S: 3, M: 4, L: 3, XL: 2 }
          }
        },
        {
          id: '4',
          name: 'Luxury Business Jacket',
          brand: 'Prada',
          image: 'https://images.unsplash.com/flagged/photo-1553802922-e345434156e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwamFja2V0fGVufDF8fHx8MTc1NTMxMDI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 380,
          rentPrice: 75,
          category: 'Outerwear',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          availability: {
            buy: { XS: 2, S: 4, M: 6, L: 4, XL: 2 },
            rent: { XS: 1, S: 2, M: 3, L: 2, XL: 1 }
          }
        },
        {
          id: '5',
          name: 'Formal Business Suit',
          brand: 'Versace',
          image: 'https://images.unsplash.com/photo-1655898283066-1b682b7b6736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBidXNpbmVzcyUyMGF0dGlyZXxlbnwxfHx8fDE3NTUzMTAyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 520,
          rentPrice: 95,
          category: 'Outerwear',
          sizes: ['S', 'M', 'L', 'XL'],
          availability: {
            buy: { S: 1, M: 2, L: 3, XL: 1 },
            rent: { S: 1, M: 1, L: 2, XL: 0 }
          }
        },
        {
          id: '6',
          name: 'Summer Casual Outfit',
          brand: 'H&M',
          image: 'https://images.unsplash.com/photo-1586024452802-86e0d084a4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBmYXNoaW9uJTIwb3V0Zml0fGVufDF8fHx8MTc1NTMxMDI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          buyPrice: 65,
          rentPrice: 18,
          category: 'Tops',
          sizes: ['XS', 'S', 'M', 'L'],
          isNew: true,
          availability: {
            buy: { XS: 6, S: 10, M: 12, L: 8 },
            rent: { XS: 2, S: 4, M: 5, L: 3 }
          }
        }
      ]
      
      await kv.set('products', sampleProducts)
      return c.json({ products: sampleProducts })
    }

    return c.json({ products })
  } catch (error) {
    console.log('Get products error:', error)
    return c.json({ error: 'Failed to get products' }, 500)
  }
})

// Create order
app.post('/make-server-2938a672/orders', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const { items, total, shippingAddress } = await c.req.json()
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const order = {
      id: orderId,
      userId: user.id,
      items,
      total,
      shippingAddress,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    // Save order
    await kv.set(`order:${orderId}`, order)

    // Update user's order history
    const profile = await kv.get(`user:${user.id}`)
    if (profile) {
      profile.orders.push(orderId)
      await kv.set(`user:${user.id}`, profile)
    }

    // Update product availability
    const products = await kv.get('products')
    if (products) {
      for (const item of items) {
        const product = products.find((p: any) => p.id === item.product.id)
        if (product && product.availability) {
          const availabilityType = item.type === 'buy' ? 'buy' : 'rent'
          if (product.availability[availabilityType][item.size] > 0) {
            product.availability[availabilityType][item.size] -= item.quantity
          }
        }
      }
      await kv.set('products', products)
    }

    return c.json({ order })
  } catch (error) {
    console.log('Create order error:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get user orders
app.get('/make-server-2938a672/orders', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const profile = await kv.get(`user:${user.id}`)
    
    if (!profile || !profile.orders) {
      return c.json({ orders: [] })
    }

    const orders = await kv.mget(profile.orders.map((id: string) => `order:${id}`))
    return c.json({ orders: orders.filter(Boolean) })
  } catch (error) {
    console.log('Get orders error:', error)
    return c.json({ error: 'Failed to get orders' }, 500)
  }
})

// Add to wishlist
app.post('/make-server-2938a672/wishlist', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const { productId } = await c.req.json()
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    if (!profile.wishlist.includes(productId)) {
      profile.wishlist.push(productId)
      await kv.set(`user:${user.id}`, profile)
    }

    return c.json({ success: true })
  } catch (error) {
    console.log('Add to wishlist error:', error)
    return c.json({ error: 'Failed to add to wishlist' }, 500)
  }
})

// Remove from wishlist
app.delete('/make-server-2938a672/wishlist/:productId', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const productId = c.req.param('productId')
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    profile.wishlist = profile.wishlist.filter((id: string) => id !== productId)
    await kv.set(`user:${user.id}`, profile)

    return c.json({ success: true })
  } catch (error) {
    console.log('Remove from wishlist error:', error)
    return c.json({ error: 'Failed to remove from wishlist' }, 500)
  }
})

// Health check
app.get('/make-server-2938a672/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)