export type User = { id: number; username: string; referrerId: number | null };
export type Summary = {
  userId: number;
  userTotal: number;
  levels: { level: number; userCount: number; total: number }[];
};
