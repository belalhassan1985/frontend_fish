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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <div className="flex items-center border rounded-md bg-background">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-muted transition-colors">-</button>
                    <span className="px-4 font-medium w-12 text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stockQty, qty + 1))} className="px-4 py-2 hover:bg-muted transition-colors">+</button>
                </div>
                <Button onClick={handleAdd} className="flex-1 py-6 text-lg" disabled={product.stockQty <= 0}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stockQty > 0 ? (added ? 'تمت الإضافة ✓' : 'إضافة للسلة') : 'نفذت الكمية'}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                {product.stockQty > 0 ? `متوفر ${product.stockQty} قطعة` : 'غير متوفر حالياً'}
            </p>
        </div>
    )
}
