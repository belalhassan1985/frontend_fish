"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Category {
    id: number;
    nameAr: string;
    slug: string;
    parentId?: number;
    children?: Category[];
}

interface MobileCategoryNavProps {
    categories: Category[];
    currentSlug?: string;
}

export function MobileCategoryNav({ categories, currentSlug }: MobileCategoryNavProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter top-level categories
    const topLevelCategories = categories.filter(c => !c.parentId);

    // Find current active category logic
    // We want to highlight the top-level parent if a child is selected
    const isActive = (cat: Category) => {
        if (!currentSlug) return false;
        if (currentSlug === cat.slug) return true;
        // Check if any child is active
        return cat.children?.some(child => child.slug === currentSlug);
    };

    // Auto-scroll to active element
    useEffect(() => {
        if (scrollRef.current) {
            const activeEl = scrollRef.current.querySelector('[data-active="true"]');
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentSlug]);

    return (
        <div className="md:hidden w-full mb-6">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x"
            >
                <Link
                    href="/products"
                    data-active={!currentSlug}
                    className={cn(
                        "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all snap-start border",
                        !currentSlug
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                            : "bg-background border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    الكل
                </Link>

                {topLevelCategories.map(cat => {
                    const active = isActive(cat);
                    return (
                        <Link
                            key={cat.id}
                            href={`/products?categorySlug=${cat.slug}`}
                            data-active={active}
                            className={cn(
                                "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all snap-start border",
                                active
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                    : "bg-background border-zinc-200 dark:border-zinc-800 text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {cat.nameAr}
                        </Link>
                    )
                })}
            </div>

            {/* Sub-categories (Optional: Show if a parent with children is selected) */}
            {currentSlug && topLevelCategories.find(c => isActive(c))?.children?.length ? (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mt-2 snap-x animate-in slide-in-from-top-2 fade-in duration-300">
                    {topLevelCategories.find(c => isActive(c))?.children?.map(child => (
                        <Link
                            key={child.id}
                            href={`/products?categorySlug=${child.slug}`}
                            className={cn(
                                "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all snap-start border",
                                currentSlug === child.slug
                                    ? "bg-zinc-800 text-white border-zinc-700"
                                    : "bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-500 hover:text-foreground"
                            )}
                        >
                            {child.nameAr}
                        </Link>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
