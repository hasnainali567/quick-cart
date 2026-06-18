import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { CreateProductInput } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import useGetStoreCategories from "@/features/category/hooks/useGetStoreCategories";
import { Icon } from '@iconify/react'

interface AddProductFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> {
  onSubmit?: (data: CreateProductInput) => void;
}

export function AddProductForm({
  className,
  onSubmit,
  ...props
}: AddProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductInput>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      unit: "piece",
      weight: undefined,
      sku: "",
      barcode: "",
      stock: 0,
      lowStockAlert: 5,
      price: 0,
      salePrice: undefined,
      costPrice: undefined,
      isActive: true,
      isFeatured: false,
      isOrganic: false,
      images: [],
    },
  });

  const { data } = useGetStoreCategories();

  const [previews, setPreviews] = useState<
    { id: string; url: string; file: File }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const unitValue = watch("unit");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      setValue(
        "images",
        updatedPreviews.map((p) => p.file),
      );
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (filesArray.length === 0) return;

      const newPreviews = filesArray.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      setValue(
        "images",
        updatedPreviews.map((p) => p.file),
      );
    }
  };

  const handleRemoveImage = (id: string) => {
    const imageToRemove = previews.find((p) => p.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    const updatedPreviews = previews.filter((p) => p.id !== id);
    setPreviews(updatedPreviews);
    setValue(
      "images",
      updatedPreviews.map((p) => p.file),
    );
  };

  const handleFormSubmit = (data: CreateProductInput) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Saving Product:", data);
      toast.success("Product configuration validated and saved!");
    }
  };

  return (
    <form
      id="add-product-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-5 gap-6 items-start overflow-auto",
        className,
      )}
      {...props}
    >
      {/* Left Column: General Info, Images, Inventory */}
      <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
        {/* General Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic product details including name, slug, description, category
              and measurements.
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {data && data.map(({ category }) => (
                            <SelectItem value={category.id}><Icon icon={category.icon} />{category.name}</SelectItem>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                  {errors.unit && (
                    <FieldError>{errors.unit.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="weight">
                    {["L", "ml"].includes(unitValue)
                      ? "Volume (ml)"
                      : "Weight (g)"}
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
                  {errors.weight && (
                    <FieldError>{errors.weight.message}</FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Product Images Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload high-quality images of the product. The first image will be
              the primary thumbnail.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Drag & Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/10 group"
            >
              <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <HugeiconsIcon
                  icon={Plus}
                  className="size-6 text-muted-foreground group-hover:text-primary"
                />
              </div>
              <span className="text-sm font-medium">
                Drag & drop files here or click to browse
              </span>
              <span className="text-xs text-muted-foreground">
                Supports PNG, JPG, JPEG, WEBP up to 5MB
              </span>
            </div>

            {/* Input Group fall back */}
            <InputGroup>
              <InputGroupInput
                placeholder="No files selected"
                value={
                  previews.length > 0 ? `${previews.length} files selected` : ""
                }
                readOnly
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <HugeiconsIcon icon={Plus} className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </InputGroup>

            {/* Image Preview Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-2">
                {previews.map((preview) => (
                  <div
                    key={preview.id}
                    className="relative group/preview aspect-square rounded-lg border bg-muted overflow-hidden"
                  >
                    <img
                      src={preview.url}
                      alt="Product preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => handleRemoveImage(preview.id)}
                      className="absolute top-1.5 right-1.5  cursor-pointer size-8 flex items-center justify-center"
                      title="Remove image"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Card */}
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
                  <FieldLabel htmlFor="sku">
                    SKU (Stock Keeping Unit)
                  </FieldLabel>
                  <Input
                    id="sku"
                    placeholder="e.g., APP-RED-001"
                    {...register("sku", { required: "SKU is required" })}
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
                  {errors.stock && (
                    <FieldError>{errors.stock.message}</FieldError>
                  )}
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
      </div>

      {/* Right Column: Pricing & Options */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Pricing Card */}
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
                {errors.price && (
                  <FieldError>{errors.price.message}</FieldError>
                )}
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

        {/* Status & Options Card */}
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
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Feature Product removed: admin-only authority */}

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
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
