import { AxeResults } from 'axe-core';

export const customMatcher: jasmine.CustomMatcherFactories = {
  toBeAccessible: function(util, customEqualityTesters) {
    return {
      compare: function(actual: AxeResults, expected) {
        const pass = actual.violations.length == 0;

        const message = actual.violations
          .map(violation => {
            const nodeSummary = violation.nodes.map(node => {
              return `
          ${node.html}

          ${node.failureSummary
            .split('\n')
            .map(line => line.trim())
            .join('\n          ')}
            `;
            });

            return `
          Impact: ${violation.impact}

          ${violation.description}

          ${violation.helpUrl}
          ${nodeSummary}
          `;
          })
          .join('\n');

        return { pass, message };
      }
    };
  }
};
