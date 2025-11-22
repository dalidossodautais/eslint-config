import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      ObjectExpression(node: Rule.Node) {
        if (node.type !== 'ObjectExpression') {
          return;
        }

        const objectNode = node as TSESTree.ObjectExpression;
        const properties = objectNode.properties.filter(
          prop => prop.type === 'Property' || prop.type === 'SpreadElement'
        );

        if (properties.length < 2) {
          return;
        }

        for (let i = 0; i < properties.length - 1; i++) {
          const currentProp = properties[i];
          const nextProp = properties[i + 1];

          const currentLastToken = sourceCode.getLastToken(currentProp as Rule.Node);
          const nextFirstToken = sourceCode.getFirstToken(nextProp as Rule.Node);

          if (currentLastToken && nextFirstToken) {
            const textBetween = sourceCode
              .getText()
              .slice(currentLastToken.range[1], nextFirstToken.range[0]);

            if (/\n\s*\n/.test(textBetween)) {
              context.report({
                fix(fixer) {
                  const fixedText = textBetween.replace(/\n\s*\n+/g, '\n');
                  return fixer.replaceTextRange(
                    [currentLastToken.range[1], nextFirstToken.range[0]],
                    fixedText
                  );
                },
                messageId: 'noEmptyLinesInObjects',
                node: nextProp as Rule.Node
              });
            }
          }
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Disallow empty lines between object properties',
      recommended: false
    },
    fixable: 'whitespace',
    messages: {
      noEmptyLinesInObjects: 'Unexpected empty line between object properties'
    },
    schema: [],
    type: 'layout'
  }
};

export default rule;
