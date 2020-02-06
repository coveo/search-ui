import { ITrigger, ITriggerRedirect } from './Trigger';

export interface IPlanResponse {
  preprocessingOutput: {
    triggers: ITrigger<any>[];
  };
  parsedInput: {
    basicExpression: string;
    largeExpression: string;
  };
}

/**
 * Describes the plan of execution of a search
 */
export class ExecutionPlan {
  constructor(private response: IPlanResponse) {}

  public get basicExpression() {
    return this.response.parsedInput.basicExpression;
  }

  public get largeExpression() {
    return this.response.parsedInput.largeExpression;
  }

  public get redirectionURL() {
    const redirects: ITriggerRedirect[] = this.response.preprocessingOutput.triggers.filter(trigger => trigger.type === 'redirect');
    return redirects.length ? redirects[0].content : null;
  }
}
