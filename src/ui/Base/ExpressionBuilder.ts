import { Assert } from '../../misc/Assert';
import { QueryUtils } from '../../utils/QueryUtils';
import * as _ from 'underscore';

/**
 * An `ExpressionBuilder` that is mostly used by the {@link QueryBuilder}.<br/>
 * It is used to build a single query expression.<br/>
 * It allows combining multiple expression parts into a single string and provides utilities to generate common expression parts.
 */
export class ExpressionBuilder {
  private parts: string[] = []; // he he he
  public wrapParts: boolean = true;

  /**
   * Add a new part to the expression.
   * @param expression
   */
  public add(expression: string) {
    Assert.isNonEmptyString(expression);
    this.parts.push(expression);
  }

  /**
   * Take another `ExpressionBuilder`, and copy it.
   * @param expression
   */
  public fromExpressionBuilder(expression: ExpressionBuilder) {
    this.parts = this.parts.concat(expression.parts);
  }

  /**
   * Add a new part to the expression, but specific for field values<br/>
   * eg @field=(value1,value2,value3).
   * @param field The field for which to create an expression (e.g.: @foo).
   * @param operator The operator to use e.g.: = (equal) == (strict equal) <> (not equal).
   * @param values The values to put in the expression.
   */
  public addFieldExpression(field: string, operator: string, values: string[]) {
    Assert.isNonEmptyString(field);
    Assert.stringStartsWith(field, '@');
    Assert.isNonEmptyString(operator);
    Assert.isLargerOrEqualsThan(1, values.length);

    this.add(QueryUtils.buildFieldExpression(field, operator, values));
  }

  /**
   * Add a new part to the expression, but specific for field values<br/>
   * eg : NOT @field==(value1, value2, value3).
   * @param field The field for which to create an expression (e.g.: @foo)
   * @param values The values to put in the expression.
   */
  public addFieldNotEqualExpression(field: string, values: string[]) {
    Assert.isNonEmptyString(field);
    Assert.stringStartsWith(field, '@');
    Assert.isLargerOrEqualsThan(1, values.length);

    this.add(QueryUtils.buildFieldNotEqualExpression(field, values));
  }

  /**
   * Removes an expression from the builder.
   * @param expression
   */
  public remove(expression: string) {
    Assert.isNonEmptyString(expression);
    var index = _.indexOf(this.parts, expression);
    if (index != -1) {
      this.parts.splice(_.indexOf(this.parts, expression), 1);
    }
  }

  /**
   * Checks if the builder is currently empty.
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return this.parts.length == 0;
  }

  /**
   * Builds the expression string by combining all the parts together.<br/>
   * @param exp expression to join the different parts, default to a space.
   * @returns {any}
   */
  public build(exp: string = ' '): string {
    if (this.parts.length == 0) {
      return undefined;
    } else if (this.parts.length == 1) {
      return this.parts[0];
    } else if (this.wrapParts) {
      return '(' + this.parts.join(')' + exp + '(') + ')';
    } else {
      return this.parts.join(exp);
    }
  }

  /**
   * @returns array containing the differents parts of the expression
  */
  public getParts(): string[] {
    return this.parts;
  }

  /**
   * Merges several `ExpressionBuilder` together.
   * @param builders Builders that should be merged.
   * @returns {Coveo.ExpressionBuilder}
   */
  static merge(...builders: ExpressionBuilder[]): ExpressionBuilder {
    var merged = new ExpressionBuilder();
    _.each(builders, (builder: ExpressionBuilder) => {
      merged.parts = merged.parts.concat(builder.parts);
    });

    return merged;
  }

  /**
   * Merges several `ExpressionBuilder` together, using the OR operator.
   * @param builders Builders that should be merged.
   * @returns {Coveo.ExpressionBuilder}
   */
  static mergeUsingOr(...builders: ExpressionBuilder[]): ExpressionBuilder {
    var nonEmpty = _.filter(builders, (b: ExpressionBuilder) => !b.isEmpty());

    var merged = new ExpressionBuilder();

    if (nonEmpty.length == 1) {
      merged.parts = [].concat(nonEmpty[0].parts);
    } else if (nonEmpty.length > 1) {
      var parts = _.map(nonEmpty, b => b.build());
      merged.add('(' + parts.join(') OR (') + ')');
    }
    return merged;
  }
}
