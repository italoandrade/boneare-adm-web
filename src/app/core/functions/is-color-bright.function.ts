export function isColorBright(hex, minDarkPerc?): boolean {
  const color = hexToRgb(hex);
  if (!color) {
    return false;
  }
  const luminosityPerc = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
  return (luminosityPerc < (minDarkPerc || 0.3));
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
