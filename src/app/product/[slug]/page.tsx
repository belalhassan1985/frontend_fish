import { Header } from "@/components/layout/header";
import { AddToCart } from "@/components/product/add-to-cart";
import { StickyAddToCartBar } from "@/components/product/sticky-add-to-cart-bar";
import { ProductGallery } from "@/components/product/product-gallery";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { Check, X } from "lucide-react";

import { Metadata } from "next";

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const title = `${product.nameAr} | ${product.nameEn || ''} | مركز المزرعة الآسيوية`;
  const description = product.description?.substring(0, 160) || `تسوق ${product.nameAr} من مركز المزرعة الآسيوية. أفضل الأسعار والجودة.`;
  const imageUrl = product.media?.[0]?.url || '/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  const inStock = product.stockQty > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameAr,
    image: product.media?.map((m: any) => m.url),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Asian Farm Center'
    },
    offers: {
      '@type': 'Offer',
      url: `https://asianfarmcenter.com/product/${product.slug}`,
      priceCurrency: 'IQD',
      price: product.price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="container py-4 md:py-12">
        <div className="flex items-center justify-between mb-2">
          <BackButton />
        </div>
        <Breadcrumbs items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المنتجات', href: '/products' },
          { label: product.nameAr },
        ]} />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 mt-4">
          {/* Gallery */}
          <ProductGallery media={product.media} />

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              {product.category && <Badge variant="secondary" className="mb-2">{product.category.nameAr}</Badge>}
              <h1 className="text-2xl md:text-3xl font-bold">{product.nameAr}</h1>
              {product.nameEn && <h2 className="text-lg text-muted-foreground dir-ltr text-right">{product.nameEn}</h2>}
            </div>

            <div className="text-3xl font-bold text-primary">
              {Number(product.price).toLocaleString()} د.ع
            </div>

            <div className="flex items-center gap-2">
              {inStock ? (
                <Badge variant="outline" className="border-green-500/40 text-green-400 bg-green-500/5 gap-1 px-3 py-1">
                  <Check className="w-3.5 h-3.5" /> متوفر
                </Badge>
              ) : (
                <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/5 gap-1 px-3 py-1">
                  <X className="w-3.5 h-3.5" /> غير متوفر
                </Badge>
              )}
              {inStock && product.stockQty <= 5 && (
                <span className="text-xs text-amber-400 font-medium">آخر {product.stockQty} قطع</span>
              )}
            </div>

            <AddToCart product={product} />

            {/* Additional Details */}
            <div className="bg-card border border-white/5 p-4 rounded-lg text-sm space-y-2">
              <p><span className="font-semibold text-foreground">الصعوبة:</span> <span className="text-muted-foreground">{product.difficulty || '-'}</span></p>
              <p><span className="font-semibold text-foreground">نوع الماء:</span> <span className="text-muted-foreground">{product.waterType || '-'}</span></p>
              {product.tempCMin && <p><span className="font-semibold text-foreground">الحرارة:</span> <span className="text-muted-foreground">{product.tempCMin}° - {product.tempCMax}°</span></p>}
            </div>

            {/* Description */}
            {product.description && (
              <>
                <hr className="border-white/10" />
                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-loose text-sm">
                  {product.description}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      {inStock && <StickyAddToCartBar product={product} />}
    </div>
  );
}
