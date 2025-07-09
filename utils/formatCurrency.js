// utils/formatCurrency.js
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  if (!number && number !== 0) return "0";

  return new Intl.NumberFormat("id-ID").format(number);
};
