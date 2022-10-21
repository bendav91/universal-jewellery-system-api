export const round = (value: number, precision: number): number => {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
};
