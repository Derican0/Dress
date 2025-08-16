import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Heart, Truck, RotateCcw, Shield } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import type { Product } from './ProductCard'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, type: 'buy' | 'rent', size: string, rentalPeriod?: string) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [purchaseType, setPurchaseType] = useState<'buy' | 'rent'>('buy')
  const [rentalPeriod, setRentalPeriod] = useState('1')

  if (!product) return null

  const handleAddToCart = () => {
    if (!selectedSize) return
    onAddToCart(product, purchaseType, selectedSize, purchaseType === 'rent' ? rentalPeriod : undefined)
    onClose()
  }

  const getRentalPrice = () => {
    const weeks = parseInt(rentalPeriod)
    const basePrice = product.rentPrice * weeks
    // Apply discounts for longer rentals
    if (weeks >= 4) return Math.round(basePrice * 0.8)
    if (weeks >= 2) return Math.round(basePrice * 0.9)
    return basePrice
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white border-0"
        style={{
          backgroundColor: 'white',
          border: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground">{product.brand}</p>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                {product.isNew && <Badge className="bg-green-500">New</Badge>}
                {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
              </div>
            </div>

            {/* Purchase Type Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Purchase Options</h3>
              <RadioGroup value={purchaseType} onValueChange={(value: 'buy' | 'rent') => setPurchaseType(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="flex-1">
                    <div className="flex justify-between">
                      <span>Buy</span>
                      <span className="font-semibold">${product.buyPrice}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Own it forever</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent" className="flex-1">
                    <div className="flex justify-between">
                      <span>Rent</span>
                      <span className="font-semibold">${getRentalPrice()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Try before you buy</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rental Period (if rent is selected) */}
            {purchaseType === 'rent' && (
              <div className="space-y-2">
                <Label>Rental Period</Label>
                <Select value={rentalPeriod} onValueChange={setRentalPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 week - ${product.rentPrice}</SelectItem>
                    <SelectItem value="2">2 weeks - ${Math.round(product.rentPrice * 2 * 0.9)} (10% off)</SelectItem>
                    <SelectItem value="4">4 weeks - ${Math.round(product.rentPrice * 4 * 0.8)} (20% off)</SelectItem>
                    <SelectItem value="8">8 weeks - ${Math.round(product.rentPrice * 8 * 0.8)} (20% off)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Selection */}
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to Cart - {purchaseType === 'buy' ? `$${product.buyPrice}` : `$${getRentalPrice()}`}
            </Button>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Authentic guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}