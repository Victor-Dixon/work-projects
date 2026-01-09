# Code Quality Guide

**Purpose:** Guidelines for running automated code quality tools across all projects.

---

## Python Projects

### Tools Used

#### Black (Code Formatter)
```bash
# Install
pip install black

# Format code
black terminal_organizer/
black isolation_api/
black isolation_proof/

# Check without formatting
black --check terminal_organizer/
```

**Configuration:** Maximum line length 88 characters (default)

#### Flake8 (Linter)
```bash
# Install
pip install flake8

# Run linting
flake8 terminal_organizer/ --max-line-length=88 --extend-ignore=E203,W503
flake8 isolation_api/ --max-line-length=88 --extend-ignore=E203,W503
flake8 isolation_proof/ --max-line-length=88 --extend-ignore=E203,W503
```

**Configuration:**
- Max line length: 88 (to match Black)
- Ignore: E203 (whitespace before ':'), W503 (line break before binary operator)

#### Mypy (Type Checking)
```bash
# Install
pip install mypy

# Run type checking
mypy terminal_organizer/
mypy isolation_api/
mypy isolation_proof/
```

**Note:** May show errors initially as projects don't have full type coverage yet.

#### Pytest (Testing)
```bash
# Install
pip install pytest pytest-cov

# Run tests
pytest

# With coverage
pytest --cov=. --cov-report=html --cov-report=term
```

---

## JavaScript Projects

### Tools Used

#### ESLint (Linter)
```bash
# Install globally or in project
npm install -g eslint
# or
npm install --save-dev eslint

# Create config
eslint --init

# Run linting
eslint battle-tetris/
eslint journal-app/
```

**Recommended Configuration:**
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
```

#### Prettier (Code Formatter)
```bash
# Install
npm install --save-dev prettier

# Format code
prettier --write "battle-tetris/**/*.{js,css,html}"
prettier --write "journal-app/**/*.{js,css,html}"

# Check without formatting
prettier --check "battle-tetris/**/*.{js,css,html}"
```

**Configuration (.prettierrc):**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## Security Scanning

### Dependency Vulnerabilities

#### Python - Safety
```bash
# Install
pip install safety

# Check dependencies
safety check -r requirements.txt
safety check -r requirements-api.txt
```

#### Node.js - npm audit
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix
```

### Code Security

#### Trivy (Comprehensive Scanner)
```bash
# Install
# See: https://github.com/aquasecurity/trivy

# Scan filesystem
trivy fs .

# Scan specific project
trivy fs isolation_api/
```

#### Gitleaks (Secret Detection)
```bash
# Install
# See: https://github.com/gitleaks/gitleaks

# Scan repository
gitleaks detect --source . --verbose
```

---

## Automated Scanning (CI/CD)

All projects use GitHub Actions workflows for automated scanning:

- **Linting:** Runs on every push and PR
- **Testing:** Runs on every push and PR
- **Security:** Runs on push, PR, and weekly schedule

See `.github/workflows/` for workflow definitions.

---

## Running All Checks Locally

### Python Projects
```bash
# Create script: scripts/check_python.sh
#!/bin/bash
PROJECT=$1
echo "Checking $PROJECT..."

echo "Running Black..."
black --check $PROJECT/

echo "Running Flake8..."
flake8 $PROJECT/ --max-line-length=88 --extend-ignore=E203,W503

echo "Running Mypy..."
mypy $PROJECT/

echo "Running Safety..."
safety check -r requirements*.txt || true

echo "Running Pytest..."
cd $PROJECT && pytest -v && cd ..
```

### JavaScript Projects
```bash
# Create script: scripts/check_js.sh
#!/bin/bash
PROJECT=$1
echo "Checking $PROJECT..."

echo "Running ESLint..."
eslint $PROJECT/

echo "Running Prettier check..."
prettier --check "$PROJECT/**/*.{js,css,html}"

echo "Running npm audit..."
if [ -f "$PROJECT/package.json" ]; then
  cd $PROJECT && npm audit && cd ..
fi
```

---

## Pre-commit Hooks

### Setup (Optional but Recommended)

```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.0
    hooks:
      - id: black
        language_version: python3.10
  
  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
  
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        types: [javascript, css, html]
EOF

# Install hooks
pre-commit install

# Test
pre-commit run --all-files
```

---

## Baseline Metrics

See [CODE_BASELINE.md](CODE_BASELINE.md) for current baseline metrics and improvement targets.

---

## Continuous Improvement

- Run quality checks before committing
- Fix issues incrementally
- Track improvements over time
- Set goals for code coverage and quality metrics

---

**Last Updated:** December 28, 2024


