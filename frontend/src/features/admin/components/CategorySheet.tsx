import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AdminCategory } from "../api/categories";

type Props = {
  category: AdminCategory;
  trigger: React.ReactNode;
};

const CategorySheet = ({ category, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      data={category}
      title={category.name}
      description={`Created ${new Date(category.createdAt).toLocaleDateString()}`}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(data) => (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
            {/* Image + Name */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold shrink-0 overflow-hidden">
                {data.image ? (
                  <img
                    src={data.image}
                    alt={data.name}
                    className="size-full object-cover"
                  />
                ) : data.icon ? (
                  <span className="text-3xl">{data.icon}</span>
                ) : (
                  data.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <p className="text-sm text-muted-foreground">{data.slug}</p>
              </div>
            </div>

            <Separator />

            {/* Status & Sort Order */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <Badge
                    className="mt-1"
                    variant={data.isActive ? "default" : "secondary"}
                  >
                    {data.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sort Order</p>
                  <p className="text-sm font-medium mt-1">{data.sortOrder}</p>
                </div>
              </div>
            </div>

            {data.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {data.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* IDs */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Identifiers
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Category ID</p>
                <p className="text-sm font-mono mt-0.5 break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default CategorySheet;
