export interface IAPICustomEvent {
  language: string;
  device: string;
  searchInterface: string;
  searchHub: string;
  responseTime: number;
  actionType: string;
  actionCause: string;
  customMetadatas: { [name: string]: string };
}
