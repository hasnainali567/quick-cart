import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { CreateProductInput } from "@/types/product.types";

export function ProductImages() {
  const { setValue } = useFormContext<CreateProductInput>();
  const [previews, setPreviews] = useState<
    { id: string; url: string; file: File }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload high-quality images of the product. The first image will be the
          primary thumbnail.
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
            value={previews.length > 0 ? `${previews.length} files selected` : ""}
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
                  className="absolute top-1.5 right-1.5 cursor-pointer size-8 flex items-center justify-center"
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
  );
}
