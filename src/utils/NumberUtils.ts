export class NumberUtils {
  static countDecimals = function(value: number) {
    if (Math.floor(value) === value) {
      return 0;
    }

    const postDecimalValues = value.toString().split('.')[1];
    return postDecimalValues.length;
  };
}
