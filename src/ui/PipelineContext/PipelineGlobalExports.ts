import { IStringMap } from '../../rest/GenericParam';

export type Context = IStringMap<string | string[]>;

export interface IPipelineContextProvider {
  getContext: () => Context;
}
