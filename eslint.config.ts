import type { Linter } from 'eslint';

import config from './index.js';

const eslintConfig: Linter.Config[] = [
  ...config,
  {
    ignores: ['node_modules/', '**/dist/**']
  }
];

export default eslintConfig;
