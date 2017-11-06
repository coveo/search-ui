import { IStringMap } from '../../rest/GenericParam';

/**
 * A context, as returned by {@link SearchInterface.getQueryContext} or {@link PipelineContext.getContext}
 */
export type Context = IStringMap<string | string[]>;

export interface IPipelineContextProvider {
  getContext: () => Context;
}
