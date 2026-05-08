# Contributing to Headless Select

First off, thank you for considering contributing to Headless Select! It's people like you that make it a great tool for everyone.

## 🛠️ Development Setup

This project is a monorepo managed with **pnpm**.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/verbpatch/headless-select.git
    cd headless-select
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Build all packages**:
    ```bash
    pnpm run build
    ```

4.  **Run tests**:
    ```bash
    pnpm run test
    ```

## 🌿 Branching Strategy

- `main`: Production-ready code.
- `develop`: Ongoing development.
- Feature branches: `feat/your-feature-name`
- Bug fix branches: `fix/your-bug-name`

## 📝 Pull Request Process

1.  Create a new branch from `develop`.
2.  Make your changes.
3.  Ensure all tests pass and your code adheres to the project's coding standards.
4.  Add tests for any new functionality.
5.  Submit a Pull Request to the `develop` branch.
6.  Describe your changes in detail in the PR description.

## 🧪 Testing

We use **Vitest** for unit testing. Please ensure your changes have adequate test coverage.

```bash
# Run tests for a specific package
pnpm --filter "@verbpatch/headless-select" run test
```

## 📜 Coding Standards

- We use **TypeScript** for all packages.
- Follow the existing code style (Prettier and ESLint are enforced).
- Ensure all public APIs are well-documented with TSDoc comments.

## 🐞 Bug Reports

If you find a bug, please open an issue with:
- A clear description of the problem.
- Steps to reproduce.
- Expected vs actual behavior.
- Environment details (OS, Browser, Node version).

## ✨ Feature Requests

We're always open to new ideas! Please open an issue and describe:
- The problem you're trying to solve.
- Your proposed solution.
- Use cases for the feature.

Thank you for contributing!
