"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { Home, LayoutGrid, Store, ShoppingCart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems: {
  href: string;
  label: string;
  icon: any;
  isCart?: boolean;
  isExternal?: boolean;
}[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/categories", label: "الأقسام", icon: LayoutGrid },
  { href: "/products", label: "المتجر", icon: Store },
  { href: "/checkout", label: "السلة", icon: ShoppingCart, isCart: true },
  { href: "whatsapp", label: "تواصل", icon: MessageCircle, isExternal: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const cartCount = mounted ? cart.totalItems() : 0;

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/products") return pathname.startsWith("/products") || pathname.startsWith("/product/");
    if (href === "/categories") return pathname.startsWith("/categories");
    if (href === "/checkout") return pathname.startsWith("/checkout");
    return false;
  };

  const handleWhatsApp = () => {
    const phone = (process.env.NEXT_PUBLIC_CONTACT_PHONE || "+9647761671476").replace(/\s/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background border-t md:hidden shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-full px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isExternal) {
            return (
              <button
                key={item.href}
                onClick={handleWhatsApp}
                className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[44px] text-foreground/60 hover:text-foreground transition-colors flex-1"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-none">{item.label}</span>
              </button>
            );
          }
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[44px] transition-colors flex-1 relative",
                active ? "text-primary" : "text-foreground/60 hover:text-foreground"
              )}
            >
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
              <div className="relative">
                <Icon className={cn("h-5 w-5", active ? "fill-primary/10" : "")} />
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
