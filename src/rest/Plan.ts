import { ITrigger, ITriggerRedirect } from './Trigger';

/**
 * Describes the plan of execution of a search
 */
export interface IPlan {
  preprocessingOutput: {
    triggers: ITrigger<any>[];
  };
  parsedInput: {
    basicExpression: string;
    largeExpression: string;
  };
}

export class ExecutionPlan {
  static getRedirectTriggers(results: IPlan) {
    const redirects: ITriggerRedirect[] = results.preprocessingOutput.triggers.filter(trigger => trigger.type === 'redirect');
    return redirects.length ? redirects[0] : null;
  }
}
