import { IHistoryManager } from './HistoryManager';

export class NoopHistoryController implements IHistoryManager {
  public setState(state: Record<string, any>) {}
  public replaceState(state: Record<string, any>) {}
}
