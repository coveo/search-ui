import { ExecutionPlan } from '../../src/rest/Plan';
import { FakeResults } from '../Fake';

export function PlanTest() {
  describe('Plan', () => {
    let planResponse = FakeResults.createFakePlanResponse();
    let plan: ExecutionPlan;

    beforeEach(() => {
      plan = new ExecutionPlan(planResponse);
    });

    it('should extract basicExpression', () => {
      expect(plan.basicExpression).toBe(planResponse.parsedInput.basicExpression);
    });

    it('should extract largeExpression', () => {
      expect(plan.largeExpression).toBe(planResponse.parsedInput.largeExpression);
    });

    it('should extract the first redirect trigger for the redirectionURL', () => {
      planResponse.preprocessingOutput.triggers.unshift({ type: 'redirect', content: 'thisisaurl.com' });
      planResponse.preprocessingOutput.triggers.unshift({ type: 'redirect', content: 'thisisanotherurl.com' });
      expect(new ExecutionPlan(planResponse).redirectionURL).toBe('thisisanotherurl.com');
    });
  });
}
