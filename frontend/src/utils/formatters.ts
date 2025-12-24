export function formatNumber(num: number, isMoney: boolean = false): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: isMoney ? 2 : 0,
    maximumFractionDigits: 2,
  });
}
