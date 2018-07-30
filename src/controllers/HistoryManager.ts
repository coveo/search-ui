export interface IHistoryManager {
  setState(state: Record<string, any>): void;
  replaceState(state: Record<string, any>): void;
}
