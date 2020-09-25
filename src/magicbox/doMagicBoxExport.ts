import { exportGlobally } from '../GlobalExports';
import { Expression } from './Expression/Expression';
import { ExpressionConstant } from './Expression/ExpressionConstant';
import { ExpressionEndOfInput } from './Expression/ExpressionEndOfInput';
import { ExpressionFunction, ExpressionFunctionArgument } from './Expression/ExpressionFunction';
import { ExpressionList } from './Expression/ExpressionList';
import { ExpressionOptions } from './Expression/ExpressionOptions';
import { ExpressionRef } from './Expression/ExpressionRef';
import { ExpressionRegExp } from './Expression/ExpressionRegExp';
import { Grammar } from './Grammar';
import { SubGrammar } from './Grammars/Expressions';
import { Grammars } from './Grammars/Grammars';
import { InputManager } from './InputManager';
import { createMagicBox, MagicBoxInstance, requestAnimationFrame } from './MagicBox';
import { MagicBoxUtils as Utils } from './MagicBoxUtils';
import { OptionResult } from './Result/OptionResult';
import { RefResult } from './Result/RefResult';
import { EndOfInputResult, Result } from './Result/Result';
import { Suggestion, SuggestionsManager } from './SuggestionsManager';
export type ExpressionImportedLocally = Expression;
export type SuggestionImportedLocally = Suggestion;
export type SubGrammarLocally = SubGrammar;
export type ExpressionFunctionArgumentLocally = ExpressionFunctionArgument;
// export const GrammarsImportedLocally = Grammars;

export function doMagicBoxExport() {
  exportGlobally({
    MagicBox: {
      EndOfInputResult,
      ExpressionConstant,
      ExpressionEndOfInput,
      ExpressionFunction,
      ExpressionList,
      ExpressionOptions,
      ExpressionRef,
      ExpressionRegExp,
      Grammar,
      Grammars,
      InputManager,
      Instance: MagicBoxInstance,
      OptionResult,
      RefResult,
      Result,
      SuggestionsManager,
      Utils,
      create: createMagicBox,
      requestAnimationFrame
    }
  });
}

export declare namespace MagicBox {
  export const EndOfInputResult: EndOfInputResult;
  export const ExpressionConstant: ExpressionConstant;
  export const ExpressionFunction: ExpressionFunction;
  export const ExpressionList: ExpressionList;
  export const ExpressionOptions: ExpressionOptions;
  export const ExpressionRef: ExpressionRef;
  export const ExpressionRegExp: ExpressionRegExp;
  export const Grammar: Grammar;
  export const InputManager: InputManager;
  export const Instance: MagicBoxInstance;
  export const OptionResult: OptionResult;
  export const RefResult: RefResult;
  export const Result: Result;
  export const SuggestionsManager: SuggestionsManager;
  export const Utils: Utils;
  export const ExpressionEndOfInput;
  export type Instance = MagicBoxInstance;
  export type Suggestion = SuggestionImportedLocally;

  // export namespace Grammars {
  //   export const Basic: typeof GrammarsImportedLocally.Basic;
  //   export const notInWord: typeof GrammarsImportedLocally.notInWord;
  //   export const notWordStart: typeof GrammarsImportedLocally.notWordStart;
  //   export const Complete: typeof GrammarsImportedLocally.Complete;
  //   export const Date: typeof GrammarsImportedLocally.Date;
  //   export const Expressions: typeof GrammarsImportedLocally.Expressions;
  //   export const ExpressionsGrammar: typeof GrammarsImportedLocally.ExpressionsGrammar;
  //   export const Field: typeof GrammarsImportedLocally.Field;
  //   export const NestedQuery: typeof GrammarsImportedLocally.NestedQuery;
  //   export const QueryExtension: typeof GrammarsImportedLocally.QueryExtension;
  //   export const SubExpression: typeof GrammarsImportedLocally.SubExpression;
  // }

  export const createMagicBox;
  export const create;
  export const requestAnimationFrame;
}
