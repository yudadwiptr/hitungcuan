import { Home, ShoppingBag, UtensilsCrossed, type LucideProps } from "lucide-react";
import type { ToolIcon as ToolIconName } from "@/lib/tools";

const ICONS = { kuliner: UtensilsCrossed, marketplace: ShoppingBag, kpr: Home };

export function ToolIcon({ name, ...props }: { name: ToolIconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden {...props} />;
}
