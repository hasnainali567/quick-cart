import { useFormContext, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { CreateProductInput } from "@/types/product.types";

export function ProductStatus() {
  const { control } = useFormContext<CreateProductInput>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status & Visibility</CardTitle>
        <CardDescription>
          Define whether the product is published or featured.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="border rounded-lg p-4 bg-muted/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  Publish Status (Active)
                </span>
                <span className="text-xs text-muted-foreground">
                  Make this product visible to customers.
                </span>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Organic Product</span>
                <span className="text-xs text-muted-foreground">
                  Mark as grown organically.
                </span>
              </div>
              <Controller
                name="isOrganic"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
