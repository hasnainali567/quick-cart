import { Input } from "@/components/ui/input";

type CategoriesSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const CategoriesSearch = ({ value, onChange }: CategoriesSearchProps) => {
  return (
    <Input
      placeholder="Search categories..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default CategoriesSearch;
