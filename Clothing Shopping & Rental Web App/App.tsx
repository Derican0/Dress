import { useState, useMemo, useEffect } from 'react'
import { Header } from './components/Header'
import { ProductCard, type Product } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { ShoppingCart, type CartItem } from './components/ShoppingCart'
import { ProductFilters, type FilterState } from './components/ProductFilters'
import { AuthModal } from './components/AuthModal'
import { Button } from './components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { auth, api } from './utils/supabase/client'
import { toast, Toaster } from 'sonner@2.0.3'

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Summer Dress',
    brand: 'Zara',
    image: 'https://images.unsplash.com/photo-1632773003373-6645a802c154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU1MzEwMjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buyPrice: 89,
    rentPrice: 25,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    isNew: true
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
    isOnSale: true
  },
  {
    id: '3',
    name: 'Casual Streetwear Set',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1736555142217-916540c7f1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzdHJlZXR3ZWFyJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU1MzEwMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buyPrice: 120,
    rentPrice: 30,
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Luxury Business Jacket',
    brand: 'Prada',
    image: 'https://images.unsplash.com/flagged/photo-1553802922-e345434156e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwamFja2V0fGVufDF8fHx8MTc1NTMxMDI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buyPrice: 380,
    rentPrice: 75,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '5',
    name: 'Formal Business Suit',
    brand: 'Versace',
    image: 'https://images.unsplash.com/photo-1655898283066-1b682b7b6736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBidXNpbmVzcyUyMGF0dGlyZXxlbnwxfHx8fDE3NTUzMTAyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    buyPrice: 520,
    rentPrice: 95,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL']
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
    isNew: true
  }
]

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    sizes: [],
    priceRange: [0, 500],
    availability: []
  })

  // Load user session and products on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing session
        const session = await auth.getSession()
        if (session.session?.user) {
          setUser(session.session.user)
          await loadUserProfile()
        }

        // Load products
        await loadProducts()
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        await loadUserProfile()
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProducts = async () => {
    try {
      const { products } = await api.getProducts()
      setProducts(products)
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products')
    }
  }

  const loadUserProfile = async () => {
    try {
      const { profile } = await api.getUserProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Category filter
      const matchesCategory = filters.categories.length === 0 || 
                             filters.categories.includes(product.category)
      
      // Brand filter
      const matchesBrand = filters.brands.length === 0 || 
                          filters.brands.includes(product.brand)
      
      // Price filter
      const matchesPrice = product.buyPrice >= filters.priceRange[0] && 
                          product.buyPrice <= filters.priceRange[1]
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.buyPrice - b.buyPrice
        case 'price-high': return b.buyPrice - a.buyPrice
        case 'name': return a.name.localeCompare(b.name)
        case 'brand': return a.brand.localeCompare(b.brand)
        default: return 0
      }
    })

    return filtered
  }, [products, searchQuery, filters, sortBy])

  const addToCart = (product: Product, type: 'buy' | 'rent', size: string, rentalPeriod?: string) => {
    const price = type === 'buy' ? product.buyPrice : 
                  rentalPeriod ? getRentalPrice(product.rentPrice, parseInt(rentalPeriod)) : 
                  product.rentPrice

    const newItem: CartItem = {
      id: `${product.id}-${type}-${size}-${rentalPeriod || ''}`,
      product,
      type,
      size,
      quantity: 1,
      rentalPeriod,
      price
    }

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      }
      return [...prev, newItem]
    })

    toast.success(`Added ${product.name} to cart`)
  }

  const getRentalPrice = (basePrice: number, weeks: number) => {
    const totalPrice = basePrice * weeks
    if (weeks >= 4) return Math.round(totalPrice * 0.8)
    if (weeks >= 2) return Math.round(totalPrice * 0.9)
    return totalPrice
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAuth = (type: 'login' | 'signup', user: any) => {
    toast.success(`${type === 'login' ? 'Logged in' : 'Account created'} successfully!`)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setCartItems([]) // Clear cart on logout
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout')
      setIsAuthOpen(true)
      return
    }

    try {
      const orderData = {
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 
               (cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 100 ? 0 : 9.99),
        shippingAddress: {
          // This would normally come from a checkout form
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      }

      const { order } = await api.createOrder(orderData)
      toast.success('Order placed successfully!')
      setCartItems([])
      setIsCartOpen(false)
      
      // Reload products to update availability
      await loadProducts()
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order')
    }
  }

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please log in to use wishlist')
      setIsAuthOpen(true)
      return
    }

    try {
      const isInWishlist = userProfile?.wishlist?.includes(productId)
      
      if (isInWishlist) {
        await api.removeFromWishlist(productId)
        toast.success('Removed from wishlist')
      } else {
        await api.addToWishlist(productId)
        toast.success('Added to wishlist')
      }
      
      // Reload user profile
      await loadUserProfile()
    } catch (error) {
      console.error('Wishlist error:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      priceRange: [0, 500],
      availability: []
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading StyleRent...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onSearch={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop Fashion</h1>
          <p className="text-muted-foreground">
            Buy your favorites or rent designer pieces for special occasions
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Welcome back, {user.user_metadata?.name || user.email}!
            </p>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
          
          <div className="flex-1" />
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="brand">Brand A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={setSelectedProduct}
                onAddToCart={addToCart}
                onToggleWishlist={user ? handleToggleWishlist : undefined}
                isInWishlist={userProfile?.wishlist?.includes(product.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={handleCheckout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuth={handleAuth}
      />
    </div>
  )
}