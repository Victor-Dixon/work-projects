#!/bin/bash
# Setup script for Python projects in WorkProjects
# Usage: ./scripts/setup_python_project.sh <project-directory>

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

echo "Setting up Python project: $PROJECT_DIR"

# Navigate to project directory
cd "$PROJECT_DIR"

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
REQUIRED_VERSION="3.10"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Warning: Python 3.10+ required. Found: $PYTHON_VERSION"
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies if requirements file exists
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
elif [ -f "../requirements.txt" ]; then
    echo "Installing dependencies from ../requirements.txt..."
    pip install -r ../requirements.txt
elif [ -f "../requirements-api.txt" ]; then
    echo "Installing dependencies from ../requirements-api.txt..."
    pip install -r ../requirements-api.txt
else
    echo "No requirements.txt found. Skipping dependency installation."
fi

# Install development tools
echo "Installing development tools..."
pip install black flake8 mypy pytest pytest-cov

echo ""
echo "✅ Setup complete!"
echo ""
echo "To activate the virtual environment, run:"
echo "  cd $PROJECT_DIR"
echo "  source .venv/bin/activate"
echo ""
echo "To run tests:"
echo "  pytest"
echo ""
echo "To format code:"
echo "  black ."
echo ""


