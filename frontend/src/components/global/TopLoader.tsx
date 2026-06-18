import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function TopLoader() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setValue((prev) => prev + 10);
    }, 100);
  }, []);

  return <Progress value={value} className="w-full fixed top-0" />;
}
