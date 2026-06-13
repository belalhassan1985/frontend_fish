"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickAddButton({ product, size = "sm" }: { product: any; size?: "sm" | "icon" }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQty <= 0) return;
    cart.addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.stockQty <= 0) {
    return (
      <Button size={size} variant="outline" disabled className="rounded-full opacity-40 cursor-not-allowed border-destructive/30 text-destructive/60">
        نفذ
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={added ? "default" : "outline"}
      onClick={handleAdd}
      className={cn(
        "rounded-full transition-all",
        added ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary shadow-sm"
      )}
    >
      {added ? (
        <><Check className="w-3.5 h-3.5 ml-1" />تم</>
      ) : (
        <><ShoppingCart className="w-3.5 h-3.5 ml-1" />أضف</>
      )}
    </Button>
  );
}
