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
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateProductInput } from "@/types/product.types";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function ProductPricing() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductInput>();

  const [isOnSale, setIsOnSale] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>
          Set base price, sales discounts and track costs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="price">Base Price (PKR)</FieldLabel>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="e.g., 299.00"
              {...register("price", {
                required: "Base price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {errors.price && <FieldError>{errors.price.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="salePrice">Put on Sale</FieldLabel>
            <Switch
              id="putOnSale"
              checked={isOnSale}
              onCheckedChange={(checked) => {
                setIsOnSale(checked);
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="salePrice">Sale Price (PKR)</FieldLabel>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              placeholder="e.g., 249.00"
              {...register("salePrice", {
                valueAsNumber: true,
                min: { value: 0, message: "Sale price cannot be negative" },
              })}
              disabled={!isOnSale}
            />
            {errors.salePrice && (
              <FieldError>{errors.salePrice.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="costPrice">Cost Price (PKR)</FieldLabel>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              placeholder="e.g., 180.00"
              {...register("costPrice", {
                valueAsNumber: true,
                min: { value: 0, message: "Cost price cannot be negative" },
              })}
            />
            <FieldDescription>
              For internal profit calculation and tracking.
            </FieldDescription>
            {errors.costPrice && (
              <FieldError>{errors.costPrice.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
