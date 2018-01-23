import { IEndpointError } from './EndpointError';
import { IErrorResponse } from './EndpointCaller';
import { Assert } from '../misc/Assert';

export class QueryError implements IEndpointError {
  public status: number;
  public message: string;
  public type: string;
  public queryExecutionReport: any;
  public name: string;

  constructor(errorResponse: IErrorResponse) {
    this.status = errorResponse.statusCode;
    this.message = errorResponse.data.message;
    this.name = this.type = errorResponse.data.type;
    this.queryExecutionReport = errorResponse.data.executionReport;

    Assert.isNumber(this.status);
    Assert.isNonEmptyString(this.message);
    Assert.isNonEmptyString(this.type);
  }
}
