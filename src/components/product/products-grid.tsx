"use client";

import { useState } from "react";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 20;

export function ProductsGrid({
  initialProducts,
  searchParamsString,
  totalPages,
}: {
  initialProducts: any[];
  searchParamsString: string;
  totalPages: number;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const getImageUrl = (url: string) =>
    url?.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`;

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(nextPage));
    params.set("limit", String(PAGE_SIZE));

    try {
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/products?${params.toString()}`;
      const res = await fetch(apiUrl, { cache: "no-store" });
      if (!res.ok) return;
      const result = await res.json();
      const newProducts = result.data ?? [];

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = page < totalPages;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <Card
            key={product.id}
            className="h-full hover:shadow-lg transition-shadow overflow-hidden bg-card border border-white/5 shadow-sm group"
          >
            <Link href={`/product/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(product.media?.[0]?.url) || "/placeholder.png"}
                  alt={product.nameAr}
                  loading="lazy"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                {product.stockQty <= 0 && (
                  <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded">
                    نفذت الكمية
                  </span>
                )}
              </div>
            </Link>
            <CardContent className="p-4 flex flex-col gap-1">
              <Link
                href={`/product/${product.slug}`}
                className="hover:text-primary transition-colors"
              >
                <h3 className="font-bold line-clamp-1">{product.nameAr}</h3>
              </Link>
              <p className="text-muted-foreground text-xs line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-primary">
                  {Number(product.price).toLocaleString()} د.ع
                </span>
                <QuickAddButton product={product} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="h-12 px-10 rounded-full text-sm font-medium gap-2 border-white/10"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> جاري التحميل...</>
            ) : (
              "عرض المزيد"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
