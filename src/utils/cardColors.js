import { colorOrder, colorlessSymbol, colorNames, colorValues } from '../constants/colors';

export function getCardColors(card) {
  const colors = colorOrder.filter((color) => card.colors?.includes(color));

  if (colors.length === 0 && card.type_line?.includes('Artifact')) {
    return [colorlessSymbol];
  }

  return colors;
}

export function getCardBackground(card) {
  const colors = getCardColors(card).map((color) => colorValues[color]);

  if (colors.length === 0) {
    return '#e5e2dc';
  }

  if (colors.length === 1) {
    return colors[0];
  }

  const segmentSize = 100 / colors.length;
  const transitionWidth = Math.min(2, segmentSize / 8);
  const stops = [`${colors[0]} 0%`];

  colors.forEach((color, index) => {
    const end = (index + 1) * segmentSize;
    const isLastColor = index === colors.length - 1;

    stops.push(`${color} ${isLastColor ? 100 : end - transitionWidth}%`);
    if (!isLastColor) {
      stops.push(`${colors[index + 1]} ${end + transitionWidth}%`);
    }
  });

  return `linear-gradient(110deg, ${stops.join(', ')})`;
}
