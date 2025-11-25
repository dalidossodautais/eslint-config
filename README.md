# @dalidossodautais/eslint-config

Complete ESLint configuration extracted from the Pro/website project, including all custom rules and configurations for TypeScript, React, and Next.js.

## Installation

```bash
npm install --save-dev @dalidossodautais/eslint-config
# or
pnpm add -D @dalidossodautais/eslint-config
# or
yarn add -D @dalidossodautais/eslint-config
```

## Required Dependencies

This package requires the following peer dependencies:

- `@eslint/js`: ^9.0.0
- `@typescript-eslint/eslint-plugin`: ^8.0.0
- `@typescript-eslint/parser`: ^8.0.0
- `eslint`: ^9.0.0
- `eslint-config-prettier`: ^10.0.0
- `eslint-plugin-import`: ^2.0.0
- `eslint-plugin-package-json`: ^0.0.0
- `eslint-plugin-perfectionist`: ^4.0.0
- `eslint-plugin-prettier`: ^5.0.0
- `eslint-plugin-react`: ^7.0.0 (optional, only if using React)
- `eslint-plugin-jest`: ^28.0.0 (optional, only if using Jest)
- `globals`: ^16.0.0

## Usage

### Default (without React or Jest)

By default, the configuration does not include React or Jest rules:

```javascript
import eslintConfig from '@dalidossodautais/eslint-config';

export default [
  ...eslintConfig,
  // Your additional configurations if needed
];
```

### With React

To enable React rules:

```javascript
import { createConfig } from '@dalidossodautais/eslint-config';

export default [
  ...createConfig({ react: true }),
  // Your additional configurations if needed
];
```

### With React (explicit)

You can also explicitly enable React rules:

```javascript
import { createConfig } from '@dalidossodautais/eslint-config';

export default [
  ...createConfig({ react: true }),
  // Your additional configurations if needed
];
```

### With Jest

To enable Jest rules for test files:

```javascript
import { createConfig } from '@dalidossodautais/eslint-config';

export default [
  ...createConfig({ jest: true }),
  // Your additional configurations if needed
];
```

### Combined Options

You can combine multiple options:

```javascript
import { createConfig } from '@dalidossodautais/eslint-config';

export default [
  ...createConfig({ react: true, jest: true }),
  // Your additional configurations if needed
];
```

## Included Custom Rules

This package includes 4 custom ESLint rules:

### 1. `custom-rules/no-box-flex`

Prevents using `display: 'flex'` in the `sx` prop of `Box` or as a direct prop. Suggests using the `Stack` component instead.

**Example:**
```tsx
// ❌ Bad
<Box sx={{ display: 'flex' }}>...</Box>
<Box display="flex">...</Box>

// ✅ Good
<Stack>...</Stack>
```

### 2. `custom-rules/no-empty-sx`

Prevents empty objects in the `sx` prop. Empty `sx` props are unnecessary and should be removed.

**Example:**
```tsx
// ❌ Bad
<Box sx={{}}>...</Box>
<Box sx={condition ? {} : { padding: 2 }}>...</Box>

// ✅ Good
<Box>...</Box>
<Box sx={condition ? undefined : { padding: 2 }}>...</Box>
```

### 3. `custom-rules/no-relative-imports`

Prevents relative imports starting with `./` or `../`. Use absolute imports with the `@/` prefix instead.

**Example:**
```tsx
// ❌ Bad
import { Button } from './components/Button';
import { utils } from '../lib/utils';

// ✅ Good
import { Button } from '@/components/Button';
import { utils } from '@/lib/utils';
```

### 4. `custom-rules/no-theme-breakpoints-in-sx`

Prevents using `theme.breakpoints.down()` and `theme.breakpoints.up()` in the `sx` prop. Use responsive object syntax instead.

**Example:**
```tsx
// ❌ Bad
<Box sx={theme => ({ [theme.breakpoints.down('lg')]: { paddingY: '0.5rem' } })}>...</Box>
<Box sx={theme => ({ [theme.breakpoints.up('md')]: { paddingY: '1rem' } })}>...</Box>

// ✅ Good
<Box sx={{ lg: { paddingY: '1rem' }, xs: { paddingY: '0.5rem' } }}>...</Box>
```

## Included Configuration

This configuration includes:

- ✅ Complete TypeScript configuration with strict rules
- ✅ React configuration with Airbnb-inspired rules
- ✅ Configuration for JavaScript/CommonJS files
- ✅ Import rules with alphabetical sorting
- ✅ Prettier integration
- ✅ Sorting rules with perfectionist
- ✅ package.json validation
- ✅ Custom rules for Material-UI

## Project Structure

```text
@dalidossodautais/eslint-config/
├── .husky/                # Git hooks (Husky)
│   ├── commit-msg         # Hook to verify commits
│   ├── pre-commit         # Hook to lint staged files
│   └── _/
│       └── husky.sh       # Husky script
├── commitlint.config.ts   # Commitlint configuration
├── index.ts               # Main configuration
├── prettier.config.ts     # Prettier configuration
├── tsconfig.json          # TypeScript configuration
├── rules/                 # Custom rules
│   ├── no-box-flex.js
│   ├── no-empty-sx.js
│   ├── no-relative-imports.js
│   └── no-theme-breakpoints-in-sx.js
├── package.json
└── README.md
```

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to standardize commit messages. Commits are automatically verified via Husky and Commitlint.

### Commit Format

Commit messages must follow this format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: Code refactoring in production
- `perf`: Performance improvement
- `test`: Adding or modifying tests
- `build`: Changes to the build system or external dependencies
- `ci`: CI configuration changes
- `chore`: Other changes that do not modify source code or tests
- `revert`: Reverting a previous commit

### Examples

```bash
feat: add new rule for no-box-flex
fix: correct import order in config
docs: update README with usage examples
refactor: simplify rule implementation
```

### Installation and Setup

After cloning the project, run:

```bash
npm install
```

The `prepare` script will automatically initialize Husky. Git hooks will be configured to verify your commits.

**Note:** If you clone the project, you may need to make the hooks executable:

```bash
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
```

### Pre-commit Hook

This project uses `lint-staged` to automatically lint and fix code before commits. The pre-commit hook will:

- Run ESLint with auto-fix on staged JavaScript/TypeScript files (`.js`, `.mjs`, `.ts`, `.tsx`)
- Format JSON and Markdown files with Prettier

This ensures that only properly formatted and linted code is committed to the repository.

## Publishing

This package is automatically published to npm using GitHub Actions when a new tag is pushed.

### Prerequisites

1. Set up an npm token as a GitHub secret named `NPM_TOKEN`:
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new secret named `NPM_TOKEN` with your npm access token

### Publishing a New Version

#### Option 1: Using Git Tags (Recommended)

1. Update the version in `package.json` (or use `pnpm version`)
2. Create and push a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. The GitHub Actions workflow will automatically:
   - Extract the version from the tag
   - Run linting
   - Publish to npm

#### Option 2: Using GitHub Actions Manual Trigger

1. Go to the Actions tab in your GitHub repository
2. Select the "Publish to npm" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `1.0.0`)
5. The workflow will:
   - Update `package.json` with the new version
   - Run linting
   - Publish to npm
   - Create and push a git tag

## License

MIT
