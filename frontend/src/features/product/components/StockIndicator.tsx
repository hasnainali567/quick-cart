import { Progress } from "@/components/ui/progress";

type Props = {
  stock: number;
  lowStockAlert: number;
};

const getStockState = (stock: number, lowStockAlert: number) => {
  if (stock === 0) return "out";
  if (stock <= lowStockAlert) return "low";
  return "good";
};

const stockUI = {
  out: {
    label: "Out of Stock",
    color: "text-[#ffb4ab]",
    bar: "[&>div]:bg-[#ffb4ab]",
  },
  low: {
    label: "Low Stock",
    color: "text-amber-400",
    bar: "[&>div]:bg-amber-400",
  },
  good: {
    label: "In Stock",
    color: "text-[#4edea3]",
    bar: "[&>div]:bg-[#4edea3]",
  },
};

export const StockIndicator = ({ stock, lowStockAlert }: Props) => {
  const state = getStockState(stock, lowStockAlert);

  const ui = stockUI[state];

  const max = lowStockAlert * 3;

  const value = stock === 0 ? 0 : Math.min((stock / max) * 100, 100);

  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      {/* stock number */}
      <span className="font-medium">{stock} units</span>

      {/* progress bar */}
      <Progress
        value={value}
        className={`h-1 max-w-3/4 bg-muted overflow-hidden ${ui.bar}`}
      />

      {/* status */}
      <span
        className={`text-[10px] uppercase font-bold tracking-tight ${ui.color}`}
      >
        {ui.label}
      </span>
    </div>
  );
};
