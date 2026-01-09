#!/bin/bash
# Setup script for JavaScript projects in WorkProjects
# Usage: ./scripts/setup_js_project.sh <project-directory>

set -e

PROJECT_DIR=$1

if [ -z "$PROJECT_DIR" ]; then
    echo "Error: Project directory not specified"
    echo "Usage: $0 <project-directory>"
    exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Directory '$PROJECT_DIR' does not exist"
    exit 1
fi

echo "Setting up JavaScript project: $PROJECT_DIR"

# Navigate to project directory
cd "$PROJECT_DIR"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "Node.js version: $NODE_VERSION"
else
    echo "Warning: Node.js not found. Please install Node.js 18+"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "Found package.json. Installing dependencies..."
    npm install
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "To start development server:"
    echo "  cd $PROJECT_DIR"
    echo "  npm start  # or appropriate command"
else
    echo "No package.json found. This appears to be a vanilla JavaScript project."
    echo ""
    echo "To run locally, use a simple HTTP server:"
    echo "  cd $PROJECT_DIR"
    echo "  python3 -m http.server 8000"
    echo "  # Or: npx http-server"
    echo ""
    echo "Then open http://localhost:8000 in your browser"
fi

echo ""
echo "✅ Setup complete!"


