import { useFormContext, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Icon } from "@iconify/react";
import type { CreateProductInput } from "@/types/product.types";
import useGetStoreCategories from "@/features/category/hooks/useGetStoreCategories";

interface ProductGeneralInfoProps {
  isSkuDirty: boolean;
}

export function ProductGeneralInfo({ isSkuDirty }: ProductGeneralInfoProps) {
  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<CreateProductInput>();

  const { data } = useGetStoreCategories({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const unitValue = watch("unit");

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic product details including name, slug, description, category and
          measurements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Product Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g., Organic Red Apples"
              {...register("name", {
                required: "Product name is required",
                onChange: (e) => {
                  const value = e.target.value;
                  if (/\s$/.test(value)) {
                    const words = value
                      .trim()
                      .split(/\s+/)
                      .filter((w: string) => w.length > 2);
                    const currentTags = getValues("tags") || [];
                    const newTags = Array.from(new Set([...currentTags, ...words]));
                    if (newTags.length > currentTags.length) {
                      setValue("tags", newTags, { shouldDirty: true });
                    }
                  }
                },
                onBlur: (e) => {
                  const value = e.target.value;
                  const words = value
                    .trim()
                    .split(/\s+/)
                    .filter((w: string) => w.length > 2);
                  const currentTags = getValues("tags") || [];
                  const newTags = Array.from(new Set([...currentTags, ...words]));
                  if (newTags.length > currentTags.length) {
                    setValue("tags", newTags, { shouldDirty: true });
                  }

                  // Auto-generate SKU
                  if (!isSkuDirty && value.trim()) {
                    const skuParts = value
                      .trim()
                      .split(/\s+/)
                      .filter((w: string) => w.length > 0);
                    const sku = skuParts
                      .slice(0, 3)
                      .map((w: string) => w.substring(0, 3).toUpperCase())
                      .join("-");
                    if (sku) {
                      setValue("sku", sku, { shouldDirty: true });
                    }
                  }
                },
              })}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the product..."
              rows={4}
              {...register("description")}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {data &&
                        data.map(({ category }) => (
                          <SelectItem key={category.id} value={category.id}>
                            <Icon
                              icon={category.icon}
                              className="size-4 shrink-0"
                            />
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <FieldError>{errors.categoryId.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="unit">Unit</FieldLabel>
              <Controller
                name="unit"
                control={control}
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="unit" className="w-full">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="kg">kg (Kilogram)</SelectItem>
                      <SelectItem value="g">g (Gram)</SelectItem>
                      <SelectItem value="L">L (Liter)</SelectItem>
                      <SelectItem value="ml">ml (Milliliter)</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="dozen">dozen</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.unit && <FieldError>{errors.unit.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="weight">
                {["L", "ml"].includes(unitValue) ? "Volume (ml)" : "Weight (g)"}
              </FieldLabel>
              <Input
                id="weight"
                type="number"
                disabled={["piece", "dozen"].includes(unitValue)}
                placeholder="e.g., 500"
                {...register("weight", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Value cannot be negative" },
                })}
              />
              {errors.weight && <FieldError>{errors.weight.message}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="tags">Tags</FieldLabel>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                const nameValue = watch("name") || "";
                const autoTags = nameValue
                  .trim()
                  .split(/\s+/)
                  .filter((w: string) => w.length > 2);

                return (
                  <TagInput
                    id="tags"
                    placeholder="Add tags..."
                    value={field.value || []}
                    onChange={field.onChange}
                    lockedTags={autoTags}
                  />
                );
              }}
            />
            <FieldDescription>
              Press Enter or comma to add a tag.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
