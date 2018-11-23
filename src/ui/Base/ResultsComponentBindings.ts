import { IComponentBindings } from './ComponentBindings';
/**
 * The bindings, or environment in which each component inside the {@link ResultList} exists.
 */
export interface IResultsComponentBindings extends IComponentBindings {
  resultElement: HTMLElement;
}
