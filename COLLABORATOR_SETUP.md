# 🚀 StyleRent - Collaborator Setup Guide

## Prerequisites
- Node.js 18+ (https://nodejs.org/)
- Git (https://git-scm.com/)
- VS Code (recommended)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Derican0/Dress.git
cd Dress
```

### 2. Install Dependencies
```bash
npm install
```
This will install all required packages including React, TypeScript, Tailwind CSS, and Supabase.

### 3. Start Development Server
```bash
npm run dev
```
The app will be available at: **http://localhost:5173**

### 4. Available Commands
- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build (port 4173)
- `npm run lint` - Run code linting

## 🛠 Development Workflow

### Project Structure
```
Dress/
├── Clothing Shopping & Rental Web App/   # Main source code
│   ├── components/                       # React components
│   ├── styles/                          # CSS styles
│   ├── utils/                           # Utilities & Supabase config
│   ├── App.tsx                          # Main app component
│   └── main.tsx                         # Entry point
├── public/                              # Static assets
├── package.json                         # Dependencies & scripts
└── vite.config.ts                       # Build configuration
```

### Making Changes
1. Edit files in `Clothing Shopping & Rental Web App/`
2. Changes will hot-reload automatically in the browser
3. Check console for any errors

### Common Issues & Solutions

#### Node.js Version Issues
If you get version errors:
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

#### Permission Issues (macOS/Linux)
```bash
sudo chown -R $(whoami) ~/.npm
```

#### Clear Cache if Needed
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

#### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

## 🌐 Environment Variables (Optional)

For production deployment with your own Supabase:
1. Create `.env.local` file in root directory
2. Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Testing the App

Once running, you can:
- Browse fashion products
- Test shopping cart functionality
- Try user authentication
- Filter and search products
- Test responsive design on mobile

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly: `npm run build`
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## 🔧 VS Code Setup (Recommended)

Install these extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

## 📞 Need Help?

- Check the browser console for errors
- Review the terminal output for build issues
- All dependencies are locked in `package-lock.json`
- The app works with demo data by default

## 🚀 Deployment

When ready to deploy:
- **Netlify**: Connect GitHub repo, build command: `npm run build`, publish dir: `dist`
- **Vercel**: Run `vercel` in project directory
- **GitHub Pages**: Run `npm run deploy`
