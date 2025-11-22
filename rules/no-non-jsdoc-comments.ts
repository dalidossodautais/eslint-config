import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        for (const comment of comments) {
          const isJSDoc = comment.type === 'Block' && comment.value.startsWith('*');

          if (!isJSDoc && comment.loc) {
            context.report({
              fix(fixer) {
                return fixer.remove(comment as unknown as Rule.Node);
              },
              loc: comment.loc,
              messageId: 'noNonJSDocComments'
            });
          }
        }
      }
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow comments that are not JSDoc comments',
      recommended: true
    },
    fixable: 'code',
    messages: {
      noNonJSDocComments:
        'Only JSDoc comments (/** ... */) are allowed. Remove this comment or convert it to JSDoc format.'
    },
    schema: [],
    type: 'suggestion'
  }
};

export default rule;
