import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    return {
      ImportDeclaration(node: Rule.Node) {
        if (node.type !== 'ImportDeclaration') {
          return;
        }
        const importNode = node as TSESTree.ImportDeclaration;

        const sourceValue = importNode.source.value;

        if (
          typeof sourceValue === 'string' &&
          (sourceValue.startsWith('./') || sourceValue.startsWith('../'))
        ) {
          context.report({
            data: { importPath: sourceValue },
            messageId: 'noRelativeImports',
            node: importNode.source
          });
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Disallow relative imports starting with ./ or ../. Use absolute imports with @/ prefix instead.',
      recommended: true
    },
    fixable: undefined,
    messages: {
      noRelativeImports:
        'Avoid using relative imports ("./" or "../"). Use absolute imports with @/ prefix instead (e.g., "@/components/..." instead of "./components/..." or "../components/...").'
    },
    schema: [],
    type: 'problem'
  }
};

export default rule;
