import type { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 mb-6">{children}</h1>
  );
}
