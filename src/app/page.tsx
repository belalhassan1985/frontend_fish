import { Header } from "@/components/layout/header";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?sort=createdAt&order=desc&limit=12`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/settings/hero_image`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const categories = await getCategories();
  const heroSetting = await getSettings();

  const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

  const heroBg = heroSetting?.settingValue ? getImageUrl(heroSetting.settingValue) : 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=2000&auto=format&fit=crop';

  const topCategories = categories.filter((c: any) => !c.parentId).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative w-full h-[40vh] md:h-[65vh] flex items-start justify-center pt-10 md:pt-16 overflow-hidden bg-background text-white">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url('${heroBg}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/10" />
          </div>
          <div className="relative z-10 container flex flex-col items-center text-center gap-2 px-4">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none">
              مركز المزرعة <span className="text-primary">الآسيوية</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-200 font-light">
              أسماك زينة • أحواض • مستلزمات • التغذية
            </p>
          </div>
        </section>

        {/* Latest Products */}
        <section className="pt-6 md:pt-12 pb-8 md:pb-16 container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>🔥</span> أحدث المنتجات
            </h2>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-white font-medium transition-colors">
              عرض الكل <span className="text-primary/70">←</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product: any) => (
              <Card key={product.id} className="overflow-hidden bg-card border border-white/5 shadow-sm group">
                <Link href={`/product/${product.slug}`}>
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(product.media?.[0]?.url) || '/placeholder.png'}
                      alt={product.nameAr}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stockQty <= 0 && (
                      <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] rounded">نفذت</span>
                    )}
                  </div>
                </Link>
                <CardContent className="p-3 md:p-4">
                  <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1 leading-tight">{product.nameAr}</h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="font-bold text-primary text-sm md:text-base">{Number(product.price).toLocaleString()} د.ع</span>
                    <QuickAddButton product={product} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        {topCategories.length > 0 && (
          <section className="pb-8 md:pb-16 container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight">الأقسام</h2>
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-white font-medium transition-colors">
              عرض الكل <span className="text-primary/70">←</span>
            </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topCategories.map((cat: any) => (
                <Link key={cat.id} href={`/products?categorySlug=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-md transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getImageUrl(cat.imageUrl) || '/placeholder.png'} alt={cat.nameAr} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 text-white">
                    <h3 className="font-bold text-sm md:text-lg leading-tight">{cat.nameAr}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
      <footer className="bg-background text-white py-10 md:py-16 border-t border-white/10">
        <div className="container grid md:grid-cols-4 gap-8 md:gap-12 text-center md:text-right">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h3 className="text-2xl font-black tracking-tight">مركز المزرعة الآسيوية</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              وجهتك الأولى لأسماك الزينة والنباتات المائية ومستلزمات الأحواض في العراق. نجمع بين الفن والطبيعة.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">روابط سريعة</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors duration-300">كل المنتجات</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors duration-300">الأقسام</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">من نحن</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>العراق - بغداد - سوق الغزل</li>
              <li dir="ltr" className="hover:text-white transition-colors cursor-pointer">{process.env.NEXT_PUBLIC_CONTACT_PHONE}</li>
              <li>info@asianfarm.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">النشرة البريدية</h4>
            <div className="flex gap-2 max-w-xs mx-auto md:mx-0">
              <input type="email" placeholder="بريدك الإلكتروني" className="bg-white/10 border-none rounded-md px-4 py-2 text-sm w-full focus:ring-1 focus:ring-white transition-all placeholder:text-gray-500" />
              <Button size="sm" variant="secondary" className="font-bold">اشترك</Button>
            </div>
          </div>
        </div>
        <div className="container mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/10 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/admin/login" className="hover:text-white/80 transition-opacity">
            <p>&copy; 2026 مركز المزرعة الآسيوية. جميع الحقوق محفوظة.</p>
          </Link>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="#" className="hover:text-white transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
