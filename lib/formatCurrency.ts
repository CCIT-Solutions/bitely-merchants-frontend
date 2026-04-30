export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
