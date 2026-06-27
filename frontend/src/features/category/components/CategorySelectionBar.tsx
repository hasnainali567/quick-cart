type CategorySelectionBarProps = {
  selectedCount: number;
  maxSelection?: number;
  onSave: () => void;
  onCancel: () => void;
};

const CategorySelectionBar = ({
  selectedCount,
  maxSelection = 10,
  onSave,
  onCancel,
}: CategorySelectionBarProps) => {
  return (
    <div className="sticky bottom-0 z-50 border-t bg-background">
      <div className="flex items-center justify-between py-4 px-6">
        <div>
          <p className="font-semibold">{selectedCount} Categories Selected</p>

          <p className="text-sm text-muted-foreground">Limit: {maxSelection}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionBar;
