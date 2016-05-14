import {Assert} from '../../misc/Assert';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {getCaseInsensitiveProperty} from '../../utils/Utils';

export interface TemplateHelperFunction {
  (...args: any[]): string;
}

export class TemplateHelpers {
  private static helpers: { [templateName: string]: TemplateHelperFunction; } = {};
  public static fieldHelpers: string[] = [];

  static registerFieldHelper<T1>(name: string, helper: (value: string, options?: any) => string) {
    TemplateHelpers.fieldHelpers.push(name);
    TemplateHelpers.registerTemplateHelper(name, helper);
  }

  static registerTemplateHelper<T1>(name: string, helper: (arg1: T1) => string);
  static registerTemplateHelper<T1, T2>(name: string, helper: (arg1: T1, arg2: T2) => string);
  static registerTemplateHelper<T1, T2, T3>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3) => string);
  static registerTemplateHelper<T1, T2, T3, T4>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => string);
  static registerTemplateHelper<T1, T2, T3, T4, T5>(name: string, helper: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => string);

  static registerTemplateHelper(name: string, helper: TemplateHelperFunction) {
    Assert.isNonEmptyString(name);
    Assert.exists(helper);

    if (UnderscoreTemplate.isLibraryAvailable()) {
      TemplateHelpers.registerTemplateHelperInUnderscore(name, helper);
    }

    TemplateHelpers.helpers[name] = helper;
  }

  static getHelper(name: string): TemplateHelperFunction {
    return getCaseInsensitiveProperty(TemplateHelpers.helpers, name);
  }

  static getHelpers() {
    return TemplateHelpers.helpers;
  }

  private static registerTemplateHelperInUnderscore(name: string, helper: TemplateHelperFunction) {
    Assert.isNonEmptyString(name);
    Assert.exists(helper);
    Assert.check(UnderscoreTemplate.isLibraryAvailable());
    UnderscoreTemplate.registerTemplateHelper(name, helper);
  }
}