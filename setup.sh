#!/bin/bash

echo "🚀 Setting up Portfolio for GitHub + Vercel deployment"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands:"
echo ""
echo "   git add ."
echo "   git commit -m \"Initial portfolio commit with Vercel fixes\""
echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "   git push -u origin main"
echo ""
echo "3. Go to Vercel.com and connect your GitHub repository"
echo "4. Deploy automatically!"
echo ""
echo "🎯 The loading screen issues have been fixed with:"
echo "   - Emergency timeout (2-3 seconds max)"
echo "   - Multiple fallback mechanisms"
echo "   - Better error handling"
echo "   - Vercel.json configuration"
echo ""
echo "✨ Your portfolio is ready for deployment!"