import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    const boxImports = new Map<string, { node: TSESTree.ImportSpecifier; source: string }>();

    function isBoxComponent(node: TSESTree.Node): boolean {
      if (node.type !== 'JSXIdentifier') {
        return false;
      }

      const componentName = node.name;
      const importInfo = boxImports.get(componentName);

      return importInfo !== undefined && importInfo.source === '@mui/material';
    }

    function hasDisplayFlex(value: TSESTree.Node): boolean {
      if (value.type !== 'Literal') {
        return false;
      }

      return value.value === 'flex';
    }

    function checkSxForDisplayFlex(sxValue: TSESTree.Node): boolean {
      if (!sxValue) {
        return false;
      }

      if (sxValue.type === 'ObjectExpression') {
        return sxValue.properties.some(prop => {
          if (prop.type !== 'Property') {
            return false;
          }
          const { key } = prop;
          let keyName: string | null = null;

          if (key.type === 'Identifier') {
            keyName = key.name;
          } else if (key.type === 'Literal') {
            keyName = String(key.value);
          }

          if (keyName === 'display') {
            return hasDisplayFlex(prop.value);
          }
          return false;
        });
      }

      if (sxValue.type === 'ArrowFunctionExpression' || sxValue.type === 'FunctionExpression') {
        const { body } = sxValue;
        if (body.type === 'ObjectExpression') {
          return checkSxForDisplayFlex(body);
        }
      }

      return false;
    }

    return {
      ImportDeclaration(node: Rule.Node) {
        if (node.type !== 'ImportDeclaration') {
          return;
        }
        const importNode = node as TSESTree.ImportDeclaration;

        const sourceValue = importNode.source.value;
        if (sourceValue === '@mui/material') {
          importNode.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier') {
              boxImports.set(spec.local.name, { node: spec, source: '@mui/material' });
            }
          });
        }
      },
      JSXOpeningElement(node: TSESTree.Node) {
        if (node.type !== 'JSXOpeningElement') {
          return;
        }
        if (!isBoxComponent(node.name)) {
          return;
        }

        const displayProp = node.attributes.find(attr => {
          return (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            attr.name.name === 'display'
          );
        });

        if (displayProp && displayProp.type === 'JSXAttribute' && displayProp.value) {
          let displayValue: TSESTree.Node | null = null;
          if (displayProp.value.type === 'JSXExpressionContainer') {
            displayValue = displayProp.value.expression;
          } else if (displayProp.value.type === 'Literal') {
            displayValue = displayProp.value;
          }

          if (displayValue && hasDisplayFlex(displayValue)) {
            context.report({ messageId: 'noBoxDisplayFlex', node: displayProp });
          }
        }

        const sxProp = node.attributes.find(attr => {
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

          if (sxValue && checkSxForDisplayFlex(sxValue)) {
            context.report({ messageId: 'noBoxDisplayFlex', node: sxProp });
          }
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Disallow display: "flex" in Box sx prop or as direct prop. Use Stack component instead.',
      recommended: true
    },
    fixable: undefined,
    messages: {
      noBoxDisplayFlex:
        'Avoid using display: "flex" in Box sx prop or as direct prop. Use Stack component from @mui/material instead.'
    },
    schema: [],
    type: 'problem'
  }
};

export default rule;
