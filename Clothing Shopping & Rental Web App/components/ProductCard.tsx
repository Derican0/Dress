import { Heart, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'

export interface Product {
  id: string
  name: string
  brand: string
  image: string
  buyPrice: number
  rentPrice: number
  category: string
  sizes: string[]
  isNew?: boolean
  isOnSale?: boolean
  availability?: {
    buy: { [size: string]: number }
    rent: { [size: string]: number }
  }
}

interface ProductCardProps {
  product: Product
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product, type: 'buy' | 'rent') => void
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: boolean
}

export function ProductCard({ product, onProductClick, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const hasAvailability = (type: 'buy' | 'rent') => {
    if (!product.availability) return true
    return Object.values(product.availability[type]).some(count => count > 0)
  }

  const getTotalAvailability = (type: 'buy' | 'rent') => {
    if (!product.availability) return 0
    return Object.values(product.availability[type]).reduce((sum, count) => sum + count, 0)
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden" onClick={() => onProductClick(product)}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-green-500">New</Badge>}
          {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
          {!hasAvailability('buy') && !hasAvailability('rent') && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist button */}
        {onToggleWishlist && (
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              isInWishlist ? 'bg-red-50 hover:bg-red-100' : 'bg-white/80 hover:bg-white'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-medium line-clamp-2">{product.name}</h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold">${product.buyPrice}</p>
              <p className="text-sm text-muted-foreground">
                Rent: ${product.rentPrice}/week
              </p>
            </div>
            {product.availability && (
              <div className="text-xs text-muted-foreground text-right">
                <div>Buy: {getTotalAvailability('buy')} left</div>
                <div>Rent: {getTotalAvailability('rent')} available</div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product, 'buy')
              }}
              disabled={!hasAvailability('buy')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Buy
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product, 'rent')
              }}
              disabled={!hasAvailability('rent')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Rent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}