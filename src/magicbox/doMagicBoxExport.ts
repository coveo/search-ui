import { exportGlobally } from '../GlobalExports';
import { Utils } from '../utils/Utils';
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
import { createMagicBox, MagicBoxInstance, requestAnimationFrame } from './MagicBox';
import { OptionResult } from './Result/OptionResult';
import { RefResult } from './Result/RefResult';
import { EndOfInputResult, Result } from './Result/Result';
import { SuggestionsManager } from './SuggestionsManager';
import { Expression } from './Expression/Expression';
import { Expression as ExpressionType } from './Expression/Expression';

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

export type Expression = ExpressionType;

export const MagicBox = {
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
};
