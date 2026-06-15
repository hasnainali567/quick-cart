import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  NeutralIcon,
  TrendingDown,
  TrendingUp,
  TrendingUpDownFreeIcons,
} from "@hugeicons/core-free-icons";
import type { StatCardProps } from "@/types/global";

const StatCard = ({
  label,
  title,
  description,
  value,
  badge,
}: StatCardProps) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {badge && (
          <CardAction>
            <Badge variant="outline">
              <HugeiconsIcon
                icon={
                  badge?.type === "positive"
                    ? TrendingUp
                    : badge.type === "negative"
                      ? TrendingDown
                      : NeutralIcon
                }
              />
              {badge.type === "positive"
                ? `+${badge.value}`
                : badge.type === "negative"
                  ? `-${badge.value}`
                  : badge.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium items-center">
          {title} <HugeiconsIcon icon={TrendingUpDownFreeIcons} size={18} />
        </div>
        <div className="text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
