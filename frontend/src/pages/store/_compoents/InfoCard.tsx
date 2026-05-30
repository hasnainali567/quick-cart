import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type Props = {
    label : string,
    badge : string,
    title : string,
    icon : IconSvgElement
};

const InfoCard = ({badge, label, title, icon}: Props) => {
  return (
    <Card className="flex flex-col p-2">
      <div className="flex justify-between">
        <div className="size-12 p-1">
          <HugeiconsIcon icon={icon} className="size-full" />
        </div>
        <Badge variant={"default"} className="uppercase m-1">{badge}</Badge>
      </div>
      <div className="px-1">
        <span className="text-sm text-muted-foreground capitalize">{label}</span>
        <h2 className="text-xl font-medium">
            {title}
        </h2>
      </div>
    </Card>
  );
};

export default InfoCard;
