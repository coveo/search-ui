import { SubGrammar } from 'Coveo/magicbox/Grammars/Expressions';
import { SubGrammar } from './Grammars/Expressions';
declare namespace Coveo {
  function doMagicBoxExport(): void;
  namespace MagicBox {
    type Grammars = {
      Basic: SubGrammar;
      Complete: SubGrammar;
      Date: SubGrammar;
      Expressions: { start: string; expressions: { [id: string]: ExpressionDef } };
      ExpressionsGrammar: Grammar;
      Field: SubGrammar;
    };
    const EndOfInputResult: EndOfInputResult;
    const ExpressionConstant: ExpressionConstant;
    const ExpressionEndOfInput: Expression;
    const ExpressionFunction: ExpressionFunction;
    const ExpressionList: ExpressionList;
    const ExpressionOptions: ExpressionOptions;
    const ExpressionRef: ExpressionRef;
    const ExpressionRegExp: ExpressionRegExp;
    const Grammar: Grammar;
    const Grammars: Grammars;
    const InputManager: InputManager;
    const Instance: MagicBoxInstance;
    const OptionResult: OptionResult;
    const RefResult: RefResult;
    const Result: Result;
    const SuggestionsManager: SuggestionsManager;
    const Utils: Utils;
    const create: typeof createMagicBox;
    const requestAnimationFrame: (callback: () => void) => number;
  }
}
