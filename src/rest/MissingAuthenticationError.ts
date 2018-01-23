import { IEndpointError } from './EndpointError';

export class MissingAuthenticationError implements IEndpointError {
  public type: string;
  public message: string;
  public isMissingAuthentication = true;
  public name: string;

  constructor(public provider: string) {
    this.name = this.type = this.message = `Missing Authentication (provider: ${provider})`;
  }
}
