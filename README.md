# StyleRent - Fashion Shopping & Rental Web App

A modern React-based web application for buying and renting fashion items, built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Dual Shopping Experience**: Buy or rent fashion items
- **User Authentication**: Secure login/signup with Supabase
- **Product Filtering**: Advanced filtering by category, brand, size, and price
- **Shopping Cart**: Add items to cart with different rental periods
- **Wishlist**: Save favorite items for later
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live inventory and pricing updates

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with CSS custom properties
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Notifications**: Sonner for toast notifications
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dress
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The app comes with pre-configured Supabase credentials in `utils/supabase/info.tsx`. For production, you should:
   
   - Create your own Supabase project
   - Set up the required database tables
   - Deploy the edge functions from `supabase/functions/`
   - Update the credentials in `utils/supabase/info.tsx`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
├── Clothing Shopping & Rental Web App/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── figma/           # Figma-generated components
│   │   ├── AuthModal.tsx    # Authentication modal
│   │   ├── Header.tsx       # App header
│   │   ├── ProductCard.tsx  # Product display card
│   │   ├── ProductFilters.tsx # Filter controls
│   │   ├── ProductModal.tsx # Product details modal
│   │   └── ShoppingCart.tsx # Shopping cart component
│   ├── styles/
│   │   └── globals.css      # Global styles and Tailwind
│   ├── supabase/
│   │   └── functions/       # Edge functions for backend logic
│   ├── utils/
│   │   └── supabase/        # Supabase client configuration
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.html           # HTML template
├── public/                  # Static assets
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Deployment

### Option 1: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Variables for Production

If deploying with your own Supabase instance, set these environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Backend Setup (Supabase)

The app requires several Supabase components:

1. **Database Tables**
   - `kv_store_2938a672`: Key-value store for app data

2. **Edge Functions**
   - Authentication endpoints
   - Product management
   - Order processing
   - Wishlist management

3. **Authentication**
   - Email/password authentication
   - User profiles

## Features in Detail

### Shopping Experience
- Browse products with high-quality images
- Filter by category, brand, size, and price range
- Sort by name, price, or brand
- Detailed product views with size selection

### Rental System
- Flexible rental periods (1-4+ weeks)
- Automatic pricing discounts for longer rentals
- Real-time availability tracking

### User Management
- Secure authentication with Supabase
- User profiles with order history
- Wishlist functionality

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email [your-email] or create an issue in the repository.