import { exportGlobally } from '../GlobalExports';
import { EndOfInputResult as EndOfInputResultTemp, Result as ResultTemp } from './Result/Result';
import { ExpressionConstant as ExpressionConstantTemp } from './Expression/ExpressionConstant';
import { ExpressionEndOfInput as ExpressionEndOfInputTemp } from './Expression/ExpressionEndOfInput';
import { ExpressionFunction as ExpressionFunctionTemp } from './Expression/ExpressionFunction';
import { ExpressionList as ExpressionListTemp } from './Expression/ExpressionList';
import { ExpressionOptions as ExpressionOptionsTemp } from './Expression/ExpressionOptions';
import { ExpressionRef as ExpressionRefTemp } from './Expression/ExpressionRef';
import { ExpressionRegExp as ExpressionRegExpTemp } from './Expression/ExpressionRegExp';
import { Grammar as GrammarTemp } from './Grammar';
import * as GrammarsTemp from './Grammars/Grammars';
import { InputManager as InputManagerTemp } from './InputManager';
import { MagicBoxInstance, createMagicBox, requestAnimationFrame as requestAnimationFrameTemp } from './MagicBox';
import { OptionResult as OptionResultTemp } from './Result/OptionResult';
import { RefResult as RefResultTemp } from './Result/RefResult';
import { Utils as UtilsTemp } from '../utils/Utils';
import { SuggestionsManager as SuggestionsManagerTemp } from './SuggestionsManager';
import { Expression } from './Expression/Expression';

export function doMagicBoxExport() {
  exportGlobally({
    MagicBox: {
      EndOfInputResult: EndOfInputResultTemp,
      ExpressionConstant: ExpressionConstantTemp,
      ExpressionEndOfInput: ExpressionEndOfInputTemp,
      ExpressionFunction: ExpressionFunctionTemp,
      ExpressionList: ExpressionListTemp,
      ExpressionOptions: ExpressionOptionsTemp,
      ExpressionRef: ExpressionRefTemp,
      ExpressionRegExp: ExpressionRegExpTemp,
      Grammar: GrammarTemp,
      Grammars: GrammarsTemp,
      InputManager: InputManagerTemp,
      Instance: MagicBoxInstance,
      OptionResult: OptionResultTemp,
      RefResult: RefResultTemp,
      Result: ResultTemp,
      SuggestionsManager: SuggestionsManagerTemp,
      Utils: UtilsTemp,
      create: createMagicBox,
      requestAnimationFrame
    }
  });
}

export namespace MagicBox {
  export const EndOfInputResult = EndOfInputResultTemp;
  export const ExpressionConstant = ExpressionConstantTemp;
  export const ExpressionEndOfInput: Expression = ExpressionEndOfInputTemp;
  export const ExpressionFunction = ExpressionFunctionTemp;
  export const ExpressionList = ExpressionListTemp;
  export const ExpressionOptions = ExpressionOptionsTemp;
  export const ExpressionRef = ExpressionRefTemp;
  export const ExpressionRegExp = ExpressionRegExpTemp;
  export const Grammar = GrammarTemp;
  export const Grammars = GrammarsTemp;
  export const InputManager = InputManagerTemp;
  export const Instance = MagicBoxInstance;
  export const OptionResult = OptionResultTemp;
  export const RefResult = RefResultTemp;
  export const Result = ResultTemp;
  export const SuggestManager = SuggestionsManagerTemp;
  export const Utils = UtilsTemp;
  export const create = createMagicBox;
  export const requestAnimationFrame = requestAnimationFrameTemp;
}
