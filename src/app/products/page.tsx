import { MobileCategoryNav } from "@/components/product/mobile-category-nav";
import { ProductsGrid } from "@/components/product/products-grid";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";

const PAGE_SIZE = 20;

async function getProducts(searchParams: any) {
    const params = new URLSearchParams(searchParams);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
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
    const [paginated, categories] = await Promise.all([
        getProducts({ ...resolvedParams, page: '1', limit: String(PAGE_SIZE) }),
        getCategories(),
    ]);

    const initialProducts = paginated?.data ?? [];
    const total = paginated?.total ?? 0;
    const totalPages = paginated?.totalPages ?? 0;
    const searchParamsString = new URLSearchParams(resolvedParams).toString();
    const gridKey = `${resolvedParams.categorySlug ?? ''}-${resolvedParams.q ?? ''}-${resolvedParams.sort ?? ''}-${resolvedParams.order ?? ''}`;

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

                        <Breadcrumbs items={[
                            { label: 'الرئيسية', href: '/' },
                            { label: resolvedParams.q ? `بحث: ${resolvedParams.q}` : (resolvedParams.categorySlug ? 'التصنيف' : 'المنتجات') },
                        ]} />
                        <h1 className="text-2xl font-bold mb-6">
                            {resolvedParams.q ? `نتائج البحث عن: "${resolvedParams.q}"` :
                                resolvedParams.categorySlug ? 'المنتجات في القسم' : 'كل المنتجات'}
                            <span className="text-sm font-normal text-muted-foreground mx-2">({total} منتج)</span>
                        </h1>

                        {initialProducts.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                لا توجد منتجات مطابقة للبحث.
                            </div>
                        ) : (
                            <ProductsGrid
                                key={gridKey}
                                initialProducts={initialProducts}
                                searchParamsString={searchParamsString}
                                totalPages={totalPages}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
