import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    function isEmptyObject(node: TSESTree.Node): boolean {
      if (!node) {
        return false;
      }

      if (node.type === 'ObjectExpression') {
        return node.properties.length === 0;
      }

      if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
        const { body } = node;
        if (body.type === 'ObjectExpression') {
          return body.properties.length === 0;
        }
      }

      if (node.type === 'ConditionalExpression') {
        return isEmptyObject(node.consequent) || isEmptyObject(node.alternate);
      }

      return false;
    }

    return {
      JSXOpeningElement(node: TSESTree.Node) {
        if (node.type !== 'JSXOpeningElement') {
          return;
        }

        const sxProp = node.attributes.find((attr) => {
          return (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            attr.name.name === 'sx'
          );
        });

        if (sxProp && sxProp.type === 'JSXAttribute' && sxProp.value) {
          let sxValue: TSESTree.Node | null = null;
          if (sxProp.value.type === 'JSXExpressionContainer') {
            sxValue = sxProp.value.expression;
          }

          if (sxValue && isEmptyObject(sxValue)) {
            context.report({ messageId: 'noEmptySx', node: sxProp });
          }
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Disallow empty objects in sx prop. Empty sx props are unnecessary and should be removed.',
      recommended: true
    },
    fixable: undefined,
    messages: {
      noEmptySx: 'Empty sx prop is unnecessary. Remove the sx prop if it contains no styles.'
    },
    schema: [],
    type: 'problem'
  }
};

export default rule;
