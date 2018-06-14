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
import { MagicBoxInstance, createMagicBox, requestAnimationFrame } from './MagicBox';
import { OptionResult as OptionResultTemp } from './Result/OptionResult';
import { RefResult as RefResultTemp } from './Result/RefResult';
import { Utils as UtilsTemp } from '../utils/Utils';
import { SuggestionsManager as SuggestionsManagerTemp } from './SuggestionsManager';

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
