import * as MockTemp from './MockEnvironment';
import { BaseComponent } from '../src/ui/Base/BaseComponent';

export namespace Mock {
  export type IMockEnvironment = MockTemp.IMockEnvironment;
  export type IBasicComponentSetup<T extends BaseComponent> = MockTemp.IBasicComponentSetup<T>;
  export type IBasicComponentSetupWithModalBox<T extends BaseComponent> = MockTemp.IBasicComponentSetupWithModalBox<T>;
  export type AdvancedComponentSetupOptions = MockTemp.AdvancedComponentSetupOptions;
  export type IMockEnvironmentWithData<T> = MockTemp.IMockEnvironmentWithData<T>;
  export type MockEnvironmentBuilder = MockTemp.MockEnvironmentBuilder;
}

export const Mock = MockTemp;
export * from './MockEnvironment';
export * from './Simulate';
export * from './Fake';
export * from './CustomMatchers';
