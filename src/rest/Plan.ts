import { ITrigger } from './Trigger';

export interface IPlanResults {
  processingOutput: {
    triggers: ITrigger<any>[];
  };
  parsedInput: {
    basicExpression: string;
    largeExpression: string;
  };
}
