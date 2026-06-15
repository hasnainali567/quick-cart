import { useEffect, useState } from "react";

/**
 * Delays updating a value until the user has stopped typing/changing for `delay` ms.
 * Ideal for search inputs to avoid firing API calls on every keystroke.
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 400);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
