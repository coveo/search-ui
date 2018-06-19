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
import { MagicBoxInstance, createMagicBox, requestAnimationFrame } from './MagicBox';
import { OptionResult } from './Result/OptionResult';
import { RefResult } from './Result/RefResult';
import { Utils } from '../utils/Utils';
import { SuggestionsManager } from './SuggestionsManager';

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
