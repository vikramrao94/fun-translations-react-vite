import type { ReactNode } from "react";

export default function Sidepane({ children }: { children: ReactNode }) {
  return <div className="bg-zinc-50/20 max-w-sm p-6">{children}</div>;
}
