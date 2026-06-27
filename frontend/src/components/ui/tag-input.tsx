import * as React from "react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "./input-group";
import { Badge } from "./badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Plus } from "@hugeicons/core-free-icons";

interface TagInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  lockedTags?: string[];
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  className,
  lockedTags = [],
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const lastTag = value[value.length - 1];
      if (!lockedTags.includes(lastTag)) {
        onChange(value.slice(0, -1));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <InputGroup>
        <InputGroupInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" variant="ghost" onClick={addTag}>
            <HugeiconsIcon icon={Plus} className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((tag) => {
            const isLocked = lockedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1.5 px-2 py-1 text-xs"
              >
                {tag}
                {!isLocked && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground outline-none"
                    onClick={() => removeTag(tag)}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                )}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
