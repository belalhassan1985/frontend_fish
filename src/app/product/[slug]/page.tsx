import { Header } from "@/components/layout/header";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";

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
      availability: product.isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="container py-8 md:py-12">
        <BackButton />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery media={product.media} />

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              {product.category && <Badge variant="secondary" className="mb-2">{product.category.nameAr}</Badge>}
              <h1 className="text-3xl font-bold">{product.nameAr}</h1>
              {product.nameEn && <h2 className="text-xl text-muted-foreground dir-ltr text-right">{product.nameEn}</h2>}
            </div>

            <div className="text-2xl font-bold text-primary">
              {Number(product.price).toLocaleString()} د.ع
            </div>

            <Separator />

            <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-loose">
              {product.description}
            </div>

            <div className="mt-auto">
              <AddToCart product={product} />
            </div>

            {/* Additional Details */}
            <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2 mt-4">
              <p><span className="font-semibold">الصعوبة:</span> {product.difficulty || '-'}</p>
              <p><span className="font-semibold">نوع الماء:</span> {product.waterType || '-'}</p>
              {product.tempCMin && <p><span className="font-semibold">الحرارة:</span> {product.tempCMin}° - {product.tempCMax}°</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
