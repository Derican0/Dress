# 🔧 Troubleshooting Guide

## Common Issues When Setting Up

### 1. Node.js Version Issues
**Problem**: "This package requires Node.js 18+"
**Solution**: 
```bash
node --version  # Check current version
```
Download latest Node.js from nodejs.org if needed.

### 2. Permission Errors (Mac/Linux)
**Problem**: EACCES permission denied
**Solution**:
```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. Port Already in Use
**Problem**: "Port 5173 already in use"
**Solution**:
```bash
npm run dev -- --port 3000
```

### 4. Dependencies Not Installing
**Problem**: npm install fails
**Solution**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 5. TypeScript Errors
**Problem**: TypeScript compilation errors
**Solution**: The app is configured to run without strict TypeScript checking. If issues persist:
```bash
npm run build  # Test production build
```

### 6. Blank White Screen
**Problem**: App loads but shows blank page
**Solution**:
- Check browser console for errors
- Ensure you're at http://localhost:5173
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### 7. Images Not Loading
**Problem**: Product images don't show
**Solution**: This is normal - images are from external sources and may have CORS restrictions in development.

## 💡 Tips for Smooth Development

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense  
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

### Browser Developer Tools
- Open Chrome DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed requests
- Use Mobile view to test responsive design

### Git Workflow
```bash
# Get latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature

# After making changes
git add .
git commit -m "Describe your changes"
git push origin feature/your-feature
```

## 🎯 What Should Work Out of the Box

✅ React development server
✅ TypeScript compilation
✅ Tailwind CSS styling
✅ Component hot reloading
✅ Demo product data
✅ Shopping cart functionality
✅ Responsive design
✅ Modern UI components

## 🚀 Performance Tips

- Keep development server running for faster builds
- Use `npm run build` to test production bundle
- Clear browser cache if styles look wrong
- Restart dev server if hot reload stops working
