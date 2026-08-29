// Player badge colors, cycled as players are added
export const playerColorPalette = [
  '#e00d0d',
  '#f07909',
  '#eed810',
  '#0ccf2d',
  '#0616f7',
  '#c300ff',
];

export function createPlayer(id, name, colorIndex = 0) {
  return {
    id,
    name,
    color: playerColorPalette[colorIndex % playerColorPalette.length],
  };
}
