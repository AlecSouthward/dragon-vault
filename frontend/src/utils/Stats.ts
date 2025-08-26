export const formatSignedNumber = (num: number): string => {
  if (num === 0) return '0';
  return (num > 0 ? '+' : '-') + Math.abs(num);
};

export const getRollBonus = (statScore: number): number => {
  return Math.floor((statScore - 10) / 2);
};
