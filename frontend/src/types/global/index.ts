export type Badge = {
  value: string;
  className?: string;
  type: "positive" | "negative" | "neutral";
};

export type StatCardProps = {
  label: string;
  title: string;
  value: string;
  description?: string;
  badge?: Badge;
};
