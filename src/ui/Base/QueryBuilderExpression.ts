import * as _ from 'underscore';
import { ExpressionBuilder } from './ExpressionBuilder';
import { Utils } from '../../utils/Utils';

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

export class QueryBuilderExpression implements QueryBuilderExpression {
  public static isEmpty(queryBuilderExpression: QueryBuilderExpression) {
    const allNonEmptyValues = _.chain(queryBuilderExpression)
      .values()
      .compact()
      .value();

    return _.isEmpty(allNonEmptyValues);
  }

  public constructor(
    private basicExpression: string,
    private advancedExpression: string,
    private constantExpression: string,
    private disjunctionExpression: string
  ) {}

  public reset() {
    this.basicExpression = '';
    this.advancedExpression = '';
    this.constantExpression = '';
    this.disjunctionExpression = '';
  }

  public get withoutConstant(): string {
    return this.expressionBuilders.withoutConstantExpression.build();
  }

  public get full(): string {
    return ExpressionBuilder.mergeUsingOr(this.expressionBuilders.fullExpression, this.expressionBuilders.disjunctionExpression).build();
  }

  public get basic(): string {
    return this.expressionBuilders.basicExpression.build();
  }

  public set basic(value: string) {
    this.basicExpression = value;
  }

  public get advanced(): string {
    return this.expressionBuilders.advancedExpression.build();
  }

  public set advanced(value: string) {
    this.advancedExpression = value;
  }

  public get constant(): string {
    return this.expressionBuilders.constantExpression.build();
  }

  public set constant(value: string) {
    this.constantExpression = value;
  }

  public get expressionBuilders() {
    const addIfNotEmpty = (expression: ExpressionBuilder, value: string) => {
      if (Utils.isNonEmptyString(value)) {
        expression.add(value);
      }
    };

    const basicExpression = new ExpressionBuilder();
    addIfNotEmpty(basicExpression, this.basicExpression);

    const advancedExpression = new ExpressionBuilder();
    addIfNotEmpty(advancedExpression, this.advancedExpression);

    const constantExpression = new ExpressionBuilder();
    addIfNotEmpty(constantExpression, this.constantExpression);

    const disjunctionExpression = new ExpressionBuilder();
    addIfNotEmpty(disjunctionExpression, this.disjunctionExpression);

    const withoutConstantExpression = ExpressionBuilder.merge(basicExpression, advancedExpression);

    const fullExpression = ExpressionBuilder.merge(basicExpression, advancedExpression, constantExpression);

    return {
      basicExpression,
      advancedExpression,
      constantExpression,
      disjunctionExpression,
      withoutConstantExpression,
      fullExpression
    };
  }
}
