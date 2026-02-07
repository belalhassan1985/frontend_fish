import { MobileCategoryNav } from "@/components/product/mobile-category-nav";
import { Header } from "@/components/layout/header";
import { fetcher } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getProducts(searchParams: any) {
    const params = new URLSearchParams(searchParams);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`, { cache: 'no-store' });
        return res.ok ? res.json() : [];
    } catch (e) { return []; }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<any> }) {
    const resolvedParams = await searchParams;
    const products = await getProducts(resolvedParams);
    const categories = await getCategories();

    // Helper for image URLs
    const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters - Desktop Only */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold mb-4">الأقسام</h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/products" className={`text-sm hover:text-primary ${!resolvedParams.categorySlug ? 'font-bold text-primary' : ''}`}>الكل</Link>
                                {categories.filter((c: any) => !c.parentId).map((cat: any) => (
                                    <div key={cat.id} className="flex flex-col gap-1">
                                        <Link href={`/products?categorySlug=${cat.slug}`} className={`text-sm hover:text-primary ${resolvedParams.categorySlug === cat.slug ? 'font-bold text-primary' : ''}`}>
                                            {cat.nameAr}
                                        </Link>
                                        {/* Children */}
                                        <div className="mr-3 border-r pr-3 flex flex-col gap-1">
                                            {cat.children?.map((child: any) => (
                                                <Link key={child.id} href={`/products?categorySlug=${child.slug}`} className={`text-xs text-muted-foreground hover:text-primary ${resolvedParams.categorySlug === child.slug ? 'font-bold text-primary' : ''}`}>
                                                    {child.nameAr}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        {/* Mobile Category Nav */}
                        <MobileCategoryNav categories={categories} currentSlug={resolvedParams.categorySlug} />

                        <h1 className="text-2xl font-bold mb-6">
                            {resolvedParams.q ? `نتائج البحث عن: "${resolvedParams.q}"` :
                                resolvedParams.categorySlug ? 'المنتجات في القسم' : 'كل المنتجات'}
                            <span className="text-sm font-normal text-muted-foreground mx-2">({products.length} منتج)</span>
                        </h1>

                        {products.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                لا توجد منتجات مطابقة للبحث.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product: any) => (
                                    <Link key={product.id} href={`/product/${product.slug}`}>
                                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden border-none shadow-sm">
                                            <div className="aspect-square relative overflow-hidden bg-white">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={getImageUrl(product.media?.[0]?.url) || '/placeholder.png'}
                                                    alt={product.nameAr}
                                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                                />
                                                {product.stockQty <= 0 && (
                                                    <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded">نفذت الكمية</span>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold line-clamp-1 mb-1">{product.nameAr}</h3>
                                                <p className="text-muted-foreground text-xs line-clamp-2 mb-2 h-8">{product.description}</p>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="font-bold text-primary">{Number(product.price).toLocaleString()} د.ع</span>
                                                    <Button size="sm" variant="secondary" className="rounded-full shadow-sm">شراء</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
