export const round = (value: number, precision: number): number => {
  const newnumber = new Number(value + '').toFixed(
    parseInt(`${precision}`, 10),
  );
  return parseFloat(newnumber);
};
