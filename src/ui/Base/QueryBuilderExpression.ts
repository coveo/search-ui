import * as _ from 'underscore';
import { ExpressionBuilder } from './ExpressionBuilder';
import { Utils } from '../../UtilsModules';

/**
 * Describe the expressions part of a QueryBuilder.
 */
export interface IQueryBuilderExpression {
  /**
   * The whole expression
   */
  full?: string;
  /**
   * The full part, but without the constant.
   */
  withoutConstant?: string;
  /**
   * The constant part of the expression
   */
  constant?: string;
  /**
   * The basic part of the expression
   */
  basic?: string;
  /**
   * The advanced part of the expression
   */
  advanced?: string;
  /**
   * The disjunction part of the expression
   */
  disjunction?: string;
}

export class QueryBuilderExpression implements IQueryBuilderExpression {
  public static isEmpty(queryBuilderExpression: QueryBuilderExpression | IQueryBuilderExpression) {
    let expression: QueryBuilderExpression;
    if (queryBuilderExpression instanceof QueryBuilderExpression) {
      expression = queryBuilderExpression as QueryBuilderExpression;
    } else {
      expression = QueryBuilderExpression.fromQueryBuilderExpression(queryBuilderExpression as IQueryBuilderExpression);
    }
    const allNonEmptyValues = _.chain(expression)
      .values()
      .compact()
      .value();

    return _.isEmpty(allNonEmptyValues);
  }

  public static fromQueryBuilderExpression(queryBuilderExpression: IQueryBuilderExpression) {
    return new QueryBuilderExpression(
      queryBuilderExpression.basic,
      queryBuilderExpression.advanced,
      queryBuilderExpression.constant,
      queryBuilderExpression.disjunction
    );
  }

  public constructor(public basic: string, public advanced: string, public constant: string, public disjunction: string) {}

  public get expressionBuilders() {
    const addIfNotEmpty = (expression: ExpressionBuilder, value: string) => {
      if (Utils.isNonEmptyString(value)) {
        expression.add(value);
      }
    };

    const basicExpression = new ExpressionBuilder();
    addIfNotEmpty(basicExpression, this.basic);

    const advancedExpression = new ExpressionBuilder();
    addIfNotEmpty(advancedExpression, this.advanced);

    const constantExpression = new ExpressionBuilder();
    addIfNotEmpty(constantExpression, this.constant);

    const disjunctionExpression = new ExpressionBuilder();
    addIfNotEmpty(disjunctionExpression, this.disjunction);

    return {
      basicExpression,
      advancedExpression,
      constantExpression,
      disjunctionExpression
    };
  }

  public mergeWith(queryBuilderExpression: IQueryBuilderExpression) {
    const otherExpression = QueryBuilderExpression.fromQueryBuilderExpression(queryBuilderExpression);
    const otherBuilders = otherExpression.expressionBuilders;
    const builders = this.expressionBuilders;

    this.basic = ExpressionBuilder.merge(builders.basicExpression, otherBuilders.basicExpression).build();
    this.advanced = ExpressionBuilder.merge(builders.advancedExpression, otherBuilders.advancedExpression).build();
    this.constant = ExpressionBuilder.merge(builders.constantExpression, otherBuilders.constantExpression).build();
    this.disjunction = ExpressionBuilder.merge(builders.disjunctionExpression, otherBuilders.disjunctionExpression).build();

    return this;
  }
}
