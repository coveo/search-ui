import { isNull } from 'util';

export interface INumberFormatOptions {
  format: string;
}

export class NumberUtils {
  static countDecimals(value: number | String) {
    const decimalsMatch = /^\d+\.?([\d]*)$/.exec(`${value}`);
    return isNull(decimalsMatch) ? 0 : decimalsMatch[1].length;
  }
}
