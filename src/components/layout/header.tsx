"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Search, Fish, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const router = useRouter();
    const cart = useCart();
    const [isClient, setIsClient] = useState(false);
    const [q, setQ] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => setIsClient(true), []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (q.trim()) {
            router.push(`/products?q=${encodeURIComponent(q)}`);
            setIsSearchOpen(false);
        }
    };

    const getMediaUrl = (url: string) => {
        if (!url) return '/placeholder.png';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Mobile Menu */}
                <div className="flex items-center gap-2 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>القائمة</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-6">
                                <Link href="/" className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Fish size={20} /></div>
                                    الرئيسية
                                </Link>
                                <Link href="/categories" className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Menu size={20} /></div>
                                    الأقسام
                                </Link>
                                <Link href="/products" className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShoppingBag size={20} /></div>
                                    كل المنتجات
                                </Link>
                            </div>
                            <div className="mt-auto pt-6 border-t">
                                <p className="text-sm text-muted-foreground text-center">مركز المزرعة الآسيوية © 2024</p>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Mobile Search Toggle */}
                    <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-xl relative z-10">
                    <Fish className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    <div className="flex flex-col">
                        <span className="leading-none tracking-tight whitespace-nowrap">مركز المزرعة الآسيوية</span>
                        <span className="text-[8px] md:text-[10px] text-muted-foreground font-normal tracking-wider">ASIAN FARM CENTER</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">الأقسام</Link>
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">المنتجات</Link>
                </nav>

                {/* Search */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4 relative">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث عن منتج..."
                        className="pr-9"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="relative">
                                <ShoppingCart className="h-4 w-4" />
                                {isClient && cart.totalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        {cart.totalItems()}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>سلة الشراء ({isClient ? cart.totalItems() : 0})</SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-4 h-[70vh] overflow-y-auto px-1">
                                {isClient && cart.items.map((item) => (
                                    <div key={item.productId} className="flex gap-4 py-4 border-b last:border-0 relative group">
                                        <div className="h-20 w-20 bg-muted rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={getMediaUrl(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{item.name}</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 -mt-1 -mr-2"
                                                        onClick={() => cart.removeItem(item.productId)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                                <p className="text-sm font-bold text-primary mt-1">{item.price.toLocaleString()} د.ع</p>
                                            </div>

                                            <div className="flex items-center gap-3 bg-muted/50 w-fit rounded-md p-1 mt-2">
                                                <button
                                                    onClick={() => cart.updateQty(item.productId, item.qty - 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-background rounded shadow-sm hover:bg-accent disabled:opacity-50 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => cart.addItem({ id: item.productId, stockQty: item.maxQty }, 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-background rounded shadow-sm hover:bg-accent disabled:opacity-50 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isClient && cart.items.length === 0 && <p className="text-center text-muted-foreground my-10">السلة فارغة</p>}
                            </div>
                            {isClient && cart.items.length > 0 && (
                                <div className="pt-4">
                                    <div className="flex justify-between font-bold mb-4 text-lg">
                                        <span>المجموع</span>
                                        <span>{cart.totalPrice().toLocaleString()} د.ع</span>
                                    </div>
                                    <Link href="/checkout">
                                        <Button className="w-full" size="lg">متابعة الطلب</Button>
                                    </Link>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="absolute top-16 left-0 w-full bg-background border-b p-4 animate-in slide-in-from-top-2 md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            autoFocus
                            placeholder="ابحث عن منتج..."
                            className="pr-10"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-1 top-1 h-8 px-2 text-xs"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            إلغاء
                        </Button>
                    </form>
                </div>
            )}
        </header>
    );
}
