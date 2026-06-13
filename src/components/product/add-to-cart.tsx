"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export function AddToCart({ product }: { product: any }) {
    const cart = useCart();
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        cart.addItem(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (product.stockQty <= 0) return null;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
                <div className="flex items-center border rounded-md bg-background shrink-0">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-lg">-</button>
                    <span className="px-3 font-medium w-10 text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stockQty, qty + 1))} className="px-3 py-2 hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-lg">+</button>
                </div>
                <Button onClick={handleAdd} className="flex-1 h-12 text-base font-bold gap-2" disabled={product.stockQty <= 0}>
                    <ShoppingCart className="h-5 w-5" />
                    {added ? 'تمت الإضافة ✓' : 'إضافة للسلة'}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                متوفر {product.stockQty} قطعة
            </p>
        </div>
    )
}
