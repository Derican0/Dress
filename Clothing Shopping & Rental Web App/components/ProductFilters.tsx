import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'

export interface FilterState {
  categories: string[]
  brands: string[]
  sizes: string[]
  priceRange: [number, number]
  availability: string[]
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

export function ProductFilters({ filters, onFiltersChange, onClearFilters }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories']
  const brands = ['Zara', 'H&M', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Versace']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const availabilityOptions = ['Buy Only', 'Rent Only', 'Both Buy & Rent']

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'categories' | 'brands' | 'sizes' | 'availability', value: string) => {
    const currentValues = filters[key]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(key, newValues)
  }

  const getActiveFiltersCount = () => {
    return filters.categories.length +
      filters.brands.length +
      filters.sizes.length +
      filters.availability.length +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0)
  }

  const activeCount = getActiveFiltersCount()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 overflow-y-auto !gap-0 p-0 bg-white dark:bg-gray-900 text-black dark:text-white border-r-0"
        style={{
          backgroundColor: 'white',
          borderRight: 'none'
        }}
      >
        <SheetHeader className="px-6 py-4">
          <SheetTitle className="flex items-center justify-between">
            Filters
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-6 py-4">
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-medium">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleArrayFilter('categories', category)}
                  />
                  <Label htmlFor={category} className="text-sm">{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div className="space-y-3">
            <h3 className="font-medium">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleArrayFilter('brands', brand)}
                  />
                  <Label htmlFor={brand} className="text-sm">{brand}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sizes */}
          <div className="space-y-3">
            <h3 className="font-medium">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={filters.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter('sizes', size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-medium">Price Range</h3>
            <div className="px-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-3">
            <h3 className="font-medium">Availability</h3>
            <div className="space-y-2">
              {availabilityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={filters.availability.includes(option)}
                    onCheckedChange={() => toggleArrayFilter('availability', option)}
                  />
                  <Label htmlFor={option} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-white dark:bg-gray-900">
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}