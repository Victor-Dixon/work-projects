# Contributing Guidelines

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

See [DEVELOPMENT_ENVIRONMENT.md](../docs/DEVELOPMENT_ENVIRONMENT.md) for detailed setup instructions.

## Code Style

### Python Projects
- Follow PEP 8 style guide
- Use type hints for all functions
- Maximum line length: 88 characters (Black default)
- Run `black` before committing

### JavaScript Projects
- Follow ESLint configuration
- Use Prettier for formatting
- Use meaningful variable names

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(api): add rate limiting to endpoints

Implemented rate limiting using token bucket algorithm.
Limits set to 100 requests per 5 minutes per IP address.
```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Update CHANGELOG.md
   - Add/update docstrings

2. **Test Your Changes**
   - Write or update tests
   - Run existing test suite
   - Test manually if applicable

3. **Code Review**
   - Ensure code follows style guidelines
   - Address any review comments
   - Update PR based on feedback

4. **PR Description**
   - Describe what changes were made
   - Explain why changes were needed
   - Reference related issues

## Testing

- Write tests for new features
- Ensure all tests pass
- Maintain or improve test coverage
- Test edge cases

## Reporting Bugs

Use the issue tracker and include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Python version, etc.)

## Suggesting Features

- Use the issue tracker
- Clearly describe the feature
- Explain the use case
- Discuss implementation approach if applicable

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what is best for the project

## Questions?

Feel free to open an issue for questions or clarifications.

---

Thank you for contributing! 🎉


