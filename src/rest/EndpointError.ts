export interface EndpointError extends Error {
  message: string;
  type: string;
  name: string;
}
