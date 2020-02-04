import { ITrigger } from './Trigger';

/**
 * Describes the plan of execution of a search
 */
export interface IPlanResults {
  processingOutput: {
    triggers: ITrigger<any>[];
  };
  parsedInput: {
    basicExpression: string;
    largeExpression: string;
  };
}
