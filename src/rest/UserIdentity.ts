/**
 * Describe the identity of a user on the Coveo platform
 */
export interface IUserIdentity {
  /**
   * The name of the identity
   */
  name: string;
  /**
   * The provider of the identity in the Coveo platform
   */
  provider: string;
  type: string;
}
