import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    function isThemeBreakpointsCall(node: TSESTree.Node): boolean {
      if (
        node.type !== 'CallExpression' ||
        node.callee.type !== 'MemberExpression' ||
        node.callee.object.type !== 'MemberExpression'
      ) {
        return false;
      }

      const { object: innerObject, property: innerProperty } = node.callee.object;
      const { property: outerProperty } = node.callee;

      return (
        innerObject.type === 'Identifier' &&
        innerObject.name === 'theme' &&
        innerProperty.type === 'Identifier' &&
        innerProperty.name === 'breakpoints' &&
        outerProperty.type === 'Identifier' &&
        (outerProperty.name === 'down' || outerProperty.name === 'up')
      );
    }

    function hasThemeBreakpointsInObject(objExpression: TSESTree.Node): boolean {
      if (objExpression.type !== 'ObjectExpression') {
        return false;
      }

      return objExpression.properties.some((prop) => {
        if (prop.type !== 'Property') {
          return false;
        }

        if (prop.computed && isThemeBreakpointsCall(prop.key)) {
          return true;
        }

        if (prop.value.type === 'ObjectExpression') {
          return hasThemeBreakpointsInObject(prop.value);
        }

        return false;
      });
    }

    function checkSxForThemeBreakpoints(sxValue: TSESTree.Node): boolean {
      if (!sxValue) {
        return false;
      }

      if (sxValue.type === 'ObjectExpression') {
        return hasThemeBreakpointsInObject(sxValue);
      }

      if (sxValue.type === 'ArrowFunctionExpression' || sxValue.type === 'FunctionExpression') {
        const { body } = sxValue;
        if (body.type === 'ObjectExpression') {
          return hasThemeBreakpointsInObject(body);
        }
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

          if (sxValue && checkSxForThemeBreakpoints(sxValue)) {
            context.report({ messageId: 'noThemeBreakpointsInSx', node: sxProp });
          }
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Disallow theme.breakpoints.down() and theme.breakpoints.up() in sx prop, use responsive object syntax instead',
      recommended: true
    },
    fixable: undefined,
    messages: {
      noThemeBreakpointsInSx:
        'Avoid using theme.breakpoints.down() or theme.breakpoints.up() in sx prop. Use responsive object syntax instead (e.g., {{ lg: value, xs: value }})'
    },
    schema: [],
    type: 'problem'
  }
};

export default rule;
