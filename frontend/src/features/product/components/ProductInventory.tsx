import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateProductInput } from "@/types/product.types";

interface ProductInventoryProps {
  setIsSkuDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProductInventory({ setIsSkuDirty }: ProductInventoryProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductInput>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>
          Control your product catalog stock levels, SKU, and barcode.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="sku">SKU (Stock Keeping Unit)</FieldLabel>
              <Input
                id="sku"
                placeholder="e.g., APP-RED-001"
                {...register("sku", {
                  required: "SKU is required",
                  onChange: () => setIsSkuDirty(true),
                })}
              />
              {errors.sku && <FieldError>{errors.sku.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="barcode">Barcode (EAN/UPC)</FieldLabel>
              <Input
                id="barcode"
                placeholder="e.g., 123456789012"
                {...register("barcode")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="stock">Quantity in Stock</FieldLabel>
              <Input
                id="stock"
                type="number"
                placeholder="e.g., 100"
                {...register("stock", {
                  required: "Stock quantity is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />
              {errors.stock && <FieldError>{errors.stock.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="lowStockAlert">
                Low Stock Alert Limit
              </FieldLabel>
              <Input
                id="lowStockAlert"
                type="number"
                placeholder="e.g., 5"
                {...register("lowStockAlert", {
                  required: "Low stock alert limit is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Limit cannot be negative" },
                })}
              />
              {errors.lowStockAlert && (
                <FieldError>{errors.lowStockAlert.message}</FieldError>
              )}
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
