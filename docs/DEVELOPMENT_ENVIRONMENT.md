# Development Environment Setup Guide
**Created:** December 28, 2024  
**Purpose:** Standardize development environment across all WorkProjects

---

## System Requirements

### Operating System
- **Linux** (recommended) - Ubuntu 20.04+ or similar
- **macOS** - 10.15+ 
- **Windows** - Windows 10+ (WSL2 recommended)

### Required Software

#### Python
- **Version:** Python 3.10 or higher
- **Check version:** `python3 --version` or `python --version`
- **Installation:**
  - Linux: `sudo apt install python3.10 python3-pip python3-venv`
  - macOS: `brew install python@3.10`
  - Windows: Download from [python.org](https://www.python.org/downloads/)

#### Node.js (if working on web projects)
- **Version:** Node.js 18+ (LTS recommended)
- **Check version:** `node --version`
- **Installation:**
  - Linux: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs`
  - macOS: `brew install node`
  - Windows: Download from [nodejs.org](https://nodejs.org/)

#### Git
- **Version:** Git 2.30+
- **Check version:** `git --version`
- **Installation:**
  - Linux: `sudo apt install git`
  - macOS: `brew install git`
  - Windows: Download from [git-scm.com](https://git-scm.com/download/win)

---

## Project-Specific Setup

### 🖥️ Terminal Organizer (Python)

```bash
# Navigate to project
cd terminal_organizer

# Create virtual environment (recommended)
python3 -m venv .venv

# Activate virtual environment
# Linux/macOS:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

# Install dependencies (none required - uses stdlib only)
# But verify Python version
python3 --version  # Should be 3.10+

# Test installation
python3 -m terminal_organizer --help
```

**No external dependencies required** - uses Python standard library only.

---

### 🔒 Isolation API (Python/FastAPI)

```bash
# Navigate to project
cd isolation_api

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r ../requirements-api.txt

# Set up environment variables
export ISOLATION_API_DATA_DIR="./data"
export ISOLATION_API_TOKENS='{"test_token": "test_namespace"}'

# Run the API
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Test the API
curl http://localhost:8000/docs  # OpenAPI docs
```

**Dependencies:**
- `fastapi==0.126.0`
- `uvicorn[standard]==0.38.0`
- `httpx==0.28.1`

---

### 🔐 Isolation Proof (Python)

```bash
# Navigate to project
cd isolation_proof

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (check if any)
# Uses standard library primarily

# Run demo
python3 demo.py

# Run tests
python3 -m pytest test_isolation_proof.py  # If pytest available
```

**Dependencies:** To be verified (appears to use standard library)

---

### 🎮 Battle Tetris (JavaScript - Browser)

```bash
# Navigate to project
cd battle-tetris

# No build process required - pure vanilla JavaScript
# Simply open index.html in a browser

# For development, use a local server:
python3 -m http.server 8000
# Or
npx http-server

# Open http://localhost:8000 in browser
```

**Dependencies:** None - pure vanilla JavaScript

**Browser Testing:**
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

---

### 📔 Journal App (JavaScript - Browser)

```bash
# Navigate to project
cd journal-app

# No build process required - pure vanilla JavaScript
# Simply open index.html in a browser

# For development, use a local server:
python3 -m http.server 8000
# Or
npx http-server

# Open http://localhost:8000 in browser
```

**Dependencies:** None - pure vanilla JavaScript

**Browser Testing:**
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

---

## Development Tools Setup

### Code Editors/IDEs

#### Recommended: VS Code
```bash
# Install VS Code extensions:
# - Python (Microsoft)
# - Pylance (Microsoft)
# - ESLint (Microsoft)
# - Prettier (Prettier)
# - GitLens (GitKraken)
```

#### Alternative: PyCharm (for Python projects)
- Community Edition (free)
- Professional Edition (paid)

### Linting & Formatting

#### Python Projects
```bash
# Install linting tools
pip install black flake8 mypy

# Black (code formatter)
black terminal_organizer/
black isolation_api/
black isolation_proof/

# Flake8 (linter)
flake8 terminal_organizer/
flake8 isolation_api/
flake8 isolation_proof/

# Mypy (type checking)
mypy terminal_organizer/
mypy isolation_api/
```

#### JavaScript Projects
```bash
# Install ESLint and Prettier
npm install --save-dev eslint prettier

# Or use VS Code extensions (recommended)
```

### Git Configuration

```bash
# Set up Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure Git for this repository
cd WorkProjects
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## Environment Variables

### Isolation API

Create `.env` file in `isolation_api/` directory:

```bash
# Data directory for isolation API
ISOLATION_API_DATA_DIR=./data

# Token mapping (JSON format)
ISOLATION_API_TOKENS='{"partner_token_1": "namespace_1", "partner_token_2": "namespace_2"}'

# Optional: HMAC requirements
ISOLATION_API_REQUIRE_HMAC=0
ISOLATION_API_HMAC_SECRETS='{"namespace_1": "secret_key_1"}'
```

**Security Note:** Never commit `.env` files to git. Add to `.gitignore`.

---

## Virtual Environment Best Practices

### Creating Virtual Environments

```bash
# Python 3.10+ recommended
python3 -m venv .venv

# Activate
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Deactivate when done
deactivate
```

### Virtual Environment Management

- Each Python project should have its own virtual environment
- Never commit `.venv/` to git
- Use `requirements.txt` to track dependencies
- Update `requirements.txt` after adding packages: `pip freeze > requirements.txt`

---

## Testing Setup

### Python Projects

```bash
# Install pytest (recommended)
pip install pytest pytest-cov

# Run tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_example.py
```

### JavaScript Projects

```bash
# Manual testing in browser (currently)
# Future: Set up Jest or similar
```

---

## Troubleshooting

### Python Issues

**Issue:** `python3: command not found`
- **Solution:** Install Python 3.10+ or use `python` instead of `python3`

**Issue:** `pip: command not found`
- **Solution:** `python3 -m ensurepip --upgrade` or install pip separately

**Issue:** Virtual environment activation fails
- **Solution:** Recreate virtual environment: `rm -rf .venv && python3 -m venv .venv`

### Node.js Issues

**Issue:** `node: command not found`
- **Solution:** Install Node.js 18+ LTS from nodejs.org

### Git Issues

**Issue:** Permission denied (publickey)
- **Solution:** Set up SSH keys: `ssh-keygen -t ed25519 -C "your.email@example.com"`

---

## Quick Start Checklist

For a new developer setting up the environment:

- [ ] Install Python 3.10+
- [ ] Install Node.js 18+ (for web projects)
- [ ] Install Git
- [ ] Clone repository: `git clone <repo-url>`
- [ ] Set up Terminal Organizer: Create venv, test CLI
- [ ] Set up Isolation API: Create venv, install deps, set env vars
- [ ] Set up Isolation Proof: Create venv, run demo
- [ ] Test Battle Tetris: Open in browser
- [ ] Test Journal App: Open in browser
- [ ] Install development tools (VS Code, extensions)
- [ ] Configure Git user name/email
- [ ] Verify all projects work

---

## Next Steps

After setting up the development environment:

1. Read project-specific README files
2. Review code structure
3. Run existing tests (if any)
4. Review contributing guidelines
5. Start with Phase 0A tasks or assigned work

---

**Last Updated:** December 28, 2024  
**Maintained By:** Development Team


