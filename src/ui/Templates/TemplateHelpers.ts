import { Assert } from '../../misc/Assert';
import { UnderscoreTemplate } from './UnderscoreTemplate';
import { Utils } from '../../utils/Utils';

/**
 * A function that describe a templates.
 *
 * It can take any number of arguments, but needs to return a simple string.
 */
export interface ITemplateHelperFunction {
  (...args: any[]): string;
}

/**
 * Allow to register and return template helpers (essentially: Utility functions that can be executed in the context of a template to render complex elements).
 */
export class TemplateHelpers {
  private static helpers: { [templateName: string]: ITemplateHelperFunction } = {};
  public static fieldHelpers: string[] = [];

  static registerFieldHelper(name: string, helper: (value: string, options?: any) => string) {
    TemplateHelpers.fieldHelpers.push(name);
    TemplateHelpers.registerTemplateHelper(name, helper);
  }

  static registerTemplateHelper<T1>(name: string, helper: (arg1: T1) => string);
  static registerTemplateHelper<T1, T2>(name: string, helper: (arg1: T1, arg2: T2) => string);
  static registerTemplateHelper<T1, T2, T3>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3) => string);
  static registerTemplateHelper<T1, T2, T3, T4>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => string);
  static registerTemplateHelper<T1, T2, T3, T4, T5>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => string);
  /**
   * Register a new helper in the framework, that will be available inside all templates execution context.
   * @param name
   * @param helper
   */
  static registerTemplateHelper(name: string, helper: ITemplateHelperFunction) {
    Assert.isNonEmptyString(name);
    Assert.exists(helper);

    TemplateHelpers.registerTemplateHelperInUnderscore(name, helper);
    TemplateHelpers.helpers[name] = helper;
  }

  /**
   * Return a template helper function
   * @param name
   * @returns {ITemplateHelperFunction}
   */
  static getHelper(name: string): ITemplateHelperFunction {
    return Utils.getCaseInsensitiveProperty(TemplateHelpers.helpers, name);
  }

  /**
   * Get all available helpers
   */
  static getHelpers(): { [templateName: string]: ITemplateHelperFunction } {
    return TemplateHelpers.helpers;
  }

  private static registerTemplateHelperInUnderscore(name: string, helper: ITemplateHelperFunction) {
    Assert.isNonEmptyString(name);
    Assert.exists(helper);
    UnderscoreTemplate.registerTemplateHelper(name, helper);
  }
}
