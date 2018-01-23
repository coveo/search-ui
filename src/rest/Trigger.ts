/**
 * A trigger is an action that the interface will perform (show a message, execute a function, redirect users) depending on the query that was performed.<br/>
 * A trigger that can be configured in the Coveo Query Pipeline.
 */
export interface ITrigger<T> {
  type: string;
  content: T;
}

/**
 * Notify (show a message) to a user
 */
export interface ITriggerNotify extends ITrigger<string> {}

/**
 * Redirect the user to another url
 */
export interface ITriggerRedirect extends ITrigger<string> {}

/**
 * Perform a new query with a different query expression
 */
export interface ITriggerQuery extends ITrigger<string> {}

/**
 * Execute a javascript function present in the page.
 */
export interface ITriggerExecute extends ITrigger<{ name: string; params: any[] }> {}
