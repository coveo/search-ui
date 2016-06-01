export interface IEndpointError extends Error {
  message: string;
  type: string;
  name: string;
}
