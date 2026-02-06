import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    image: string; // url
    qty: number;
    maxQty: number; // stock
    slug: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: any, qty?: number) => void;
    removeItem: (productId: number) => void;
    updateQty: (productId: number, qty: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, qty = 1) => {
                set((state) => {
                    const existing = state.items.find((i) => i.productId === product.id);
                    if (existing) {
                        const newQty = Math.min(existing.qty + qty, product.stockQty);
                        return {
                            items: state.items.map((i) =>
                                i.productId === product.id ? { ...i, qty: newQty } : i
                            ),
                        };
                    }
                    const primaryImage = product.media?.find((m: any) => m.isPrimary)?.url || product.media?.[0]?.url || '';
                    return {
                        items: [
                            ...state.items,
                            {
                                productId: product.id,
                                name: product.nameAr,
                                price: Number(product.price),
                                image: primaryImage,
                                qty: Math.min(qty, product.stockQty),
                                maxQty: product.stockQty,
                                slug: product.slug
                            },
                        ],
                    };
                });
            },
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.productId !== id) })),
            updateQty: (id, qty) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.productId === id ? { ...i, qty: Math.max(1, Math.min(qty, i.maxQty)) } : i
                    ),
                })),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),
            totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
        }),
        {
            name: 'fish-store-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
