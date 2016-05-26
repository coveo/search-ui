declare module CoveoAnalytics {

  export interface CoveoUA {
    history: History;
  }

  export interface History {
    HistoryStore: {
      new(): HistoryStore
    }
  }

  export class HistoryStore {
    constructor();

    addElement(elem: HistoryElement): void;

    getHistory(): HistoryElement[];

    setHistory(history: HistoryElement[]): void;

    clear(): void;
  }

  export type HistoryElement = HistoryViewElement | HistoryQueryElement | any;
  export interface HistoryViewElement {
    type: string;
    uri: string;
    title?: string;
  }
  export interface HistoryQueryElement {
    name: string;
    value: string;
    time: string;
  }
}

