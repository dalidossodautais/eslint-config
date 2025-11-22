// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import packageJson from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import globals from 'globals';

import noBoxFlexRule from './rules/no-box-flex.js';
import noEmptySxRule from './rules/no-empty-sx.js';
import noRelativeImportsRule from './rules/no-relative-imports.js';
import noThemeBreakpointsInSxRule from './rules/no-theme-breakpoints-in-sx.js';

const importOrderConfig: Linter.RuleEntry = [
  'error',
  {
    alphabetize: {
      caseInsensitive: true,
      order: 'asc'
    },
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    'newlines-between': 'always',
    pathGroups: [
      {
        group: 'internal',
        pattern: '@/**',
        position: 'before'
      }
    ],
    pathGroupsExcludedImportTypes: ['builtin']
  }
];

const config: Linter.Config[] = [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        projectService: true,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescript as unknown as Record<string, unknown>,
      'custom-rules': {
        rules: {
          'no-box-flex': noBoxFlexRule,
          'no-empty-sx': noEmptySxRule,
          'no-relative-imports': noRelativeImportsRule,
          'no-theme-breakpoints-in-sx': noThemeBreakpointsInSxRule
        }
      },
      import: importPlugin,
      perfectionist,
      prettier,
      react
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,

      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports', prefer: 'type-imports' }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-loss-of-precision': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'array-callback-return': ['error', { allowImplicit: true }],
      // Custom rules
      'custom-rules/no-box-flex': 'error',
      'custom-rules/no-empty-sx': 'error',
      'custom-rules/no-relative-imports': 'error',
      'custom-rules/no-theme-breakpoints-in-sx': 'error',

      'default-case': 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'always'],

      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-duplicates': 'error',
      'import/no-relative-parent-imports': 'error',
      'import/no-self-import': 'error',
      'import/order': importOrderConfig,
      'no-alert': 'warn',
      'no-array-constructor': 'off',
      'no-caller': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-proto': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              importNames: ['default'],
              message:
                "Default React import is not needed. React 17+ does not require importing React for JSX. Use named imports if needed (e.g., import { useState } from 'react').",
              name: 'react'
            }
          ]
        }
      ],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',

      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-underscore-dangle': 'off',
      'no-unneeded-ternary': 'error',
      // Airbnb best practices - General
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-use-before-define': 'off',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'off',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'alphabetical' }],
      // Sorting rules
      'perfectionist/sort-objects': ['error', { order: 'asc', type: 'alphabetical' }],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'off',
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true
        }
      ],
      'quote-props': ['error', 'as-needed'],
      quotes: ['error', 'single', { allowTemplateLiterals: false, avoidEscape: true }],
      radix: 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-spacing': ['error', { children: true, when: 'never' }],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-spreading': 'off',
      // Airbnb-inspired rules - React
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true
        }
      ],
      'react/jsx-tag-spacing': [
        'error',
        {
          afterOpening: 'never',
          beforeClosing: 'never',
          beforeSelfClosing: 'always',
          closingSlash: 'never'
        }
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-wrap-multilines': [
        'error',
        {
          arrow: 'parens-new-line',
          assignment: 'parens-new-line',
          condition: 'parens-new-line',
          declaration: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
          return: 'parens-new-line'
        }
      ],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/no-unused-state': 'error',

      'react/prop-types': 'off', // Using TypeScript for prop validation

      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/require-default-props': 'off',
      'react/self-closing-comp': 'error',
      yoda: 'error'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: [
      '**/*.config.{js,cjs,mjs}',
      '**/.eslintrc.*',
      '**/jest.config.mjs',
      '**/.prettierrc.mjs'
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      import: importPlugin,
      perfectionist,
      prettier
    },
    rules: {
      ...js.configs.recommended.rules,

      'import/first': 'error',
      'import/newline-after-import': 'error',

      'import/no-absolute-path': 'error',
      'import/no-duplicates': 'error',
      'import/no-relative-parent-imports': 'error',
      'import/no-self-import': 'error',
      'import/order': importOrderConfig,
      'no-process-exit': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*']
            }
          ]
        }
      ],
      'perfectionist/sort-objects': ['error', { order: 'asc', type: 'alphabetical' }],

      'prefer-template': 'off',

      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true
        }
      ],

      quotes: ['error', 'single', { allowTemplateLiterals: false, avoidEscape: true }]
    }
  },
  {
    ...packageJson.configs.recommended,
    files: ['package.json']
  },
  {
    ignores: [
      'node_modules/',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
      '**/.next/**',
      '**/*.min.js'
    ]
  },
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    rules: {
      curly: ['error', 'all']
    }
  },
  {
    // Disable no-relative-imports for internal module files
    files: ['index.ts', 'eslint.config.ts', 'rules/**/*.ts'],
    rules: {
      'custom-rules/no-relative-imports': 'off'
    }
  }
];

export default config;
