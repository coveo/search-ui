import { exportGlobally } from '../GlobalExports';
import { EndOfInputResult, Result } from './Result/Result';
import { ExpressionConstant } from './Expression/ExpressionConstant';
import { ExpressionEndOfInput } from './Expression/ExpressionEndOfInput';
import { ExpressionFunction } from './Expression/ExpressionFunction';
import { ExpressionList } from './Expression/ExpressionList';
import { ExpressionOptions } from './Expression/ExpressionOptions';
import { ExpressionRef } from './Expression/ExpressionRef';
import { ExpressionRegExp } from './Expression/ExpressionRegExp';
import { Grammar } from './Grammar';
import * as Grammars from './Grammars/Grammars';
import { InputManager } from './InputManager';
import { MagicBox, create, requestAnimationFrame } from './MagicBox';
import { OptionResult } from './Result/OptionResult';
import { RefResult } from './Result/RefResult';
import { SuggestionsManager } from './SuggestionsManager';
import { Utils } from '../utils/Utils';

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
      Instance: MagicBox,
      OptionResult,
      RefResult,
      Result,
      SuggestionsManager,
      Utils,
      create,
      requestAnimationFrame
    }
  });
}
