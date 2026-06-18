import { Suspense } from "react";
import { TopLoader } from "./TopLoader";

interface Props {
  children: React.ReactNode;
}

export function SuspenseWithLoader({ children }: Props) {
  return <Suspense fallback={<TopLoader />}>{children}</Suspense>;
}
