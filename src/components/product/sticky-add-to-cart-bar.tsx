"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

export function StickyAddToCartBar({ product }: { product: any }) {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAdd = () => {
    cart.addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = mounted ? Number(product.price).toLocaleString() : "";

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 bg-background/95 border-t backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">المجموع</span>
          <span className="font-bold text-primary text-lg">{price} د.ع</span>
        </div>
        <Button
          onClick={handleAdd}
          size="lg"
          className="h-10 px-6 text-sm font-bold gap-2 rounded-full"
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "تمت الإضافة ✓" : "إضافة للسلة"}
        </Button>
      </div>
    </div>
  );
}
