import * as MockTemp from './MockEnvironment';
import { BaseComponent } from '../src/ui/Base/BaseComponent';

export const Mock = MockTemp;
export namespace Mock {
  export type IMockEnvironment = MockTemp.IMockEnvironment;
  export type IBasicComponentSetup<T extends BaseComponent> = MockTemp.IBasicComponentSetup<T>;
  export type IBasicComponentSetupWithModalBox<T extends BaseComponent> = MockTemp.IBasicComponentSetupWithModalBox<T>;
  export type IMockEnvironmentWithData<T> = MockTemp.IMockEnvironmentWithData<T>;
}

export * from './MockEnvironment';
export * from './Simulate';
export * from './Fake';
export * from './CustomMatchers';
