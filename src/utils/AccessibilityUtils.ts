export function getHeadingTag(level?: number, fallbackTag = 'div') {
  if (level === undefined || level < 1 || level > 6) {
    return fallbackTag;
  }
  return `h${level}`;
}
