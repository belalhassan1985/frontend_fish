import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Leaf } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products?featured=true`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`, { next: { revalidate: 3600 } });
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
  const heroSetting = await getSettings(); // Fetch hero image

  // Helper for image URLs
  const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

  const heroBg = heroSetting?.settingValue ? getImageUrl(heroSetting.settingValue) : 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-1">

        {/* Modern Hero Section - Adidas Style (Big Bold Visuals) */}
        <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
          <div className="absolute inset-0 z-0">
            {/* Use a high-quality abstract or aquatic gradient/image placeholder */}
            <div
              className="w-full h-full bg-cover bg-center opacity-60 hover:scale-105 transition-transform duration-[2s]"
              style={{ backgroundImage: `url('${heroBg}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>

          <div className="relative z-10 container text-center flex flex-col items-center justify-center h-full space-y-8 px-4 mt-10">
            <span className="inline-block py-2 px-4 border border-white/30 rounded-full text-xs font-bold tracking-[0.1em] backdrop-blur-md bg-white/5 animate-in fade-in zoom-in duration-1000">
              تأسس عام 2022
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none drop-shadow-2xl">
              مركز <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">المزرعة الآسيوية</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              الفن الطبيعي في منزلك. تشكيلة نادرة من أسماك الزينة والنباتات المائية.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-md mx-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full px-10 py-8 text-xl font-bold bg-white text-black hover:bg-gray-200 transition-all hover:scale-105 shadow-xl">
                  تسوق الآن
                </Button>
              </Link>
              <Link href="/categories" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full px-10 py-8 text-xl font-bold border-2 border-white text-white bg-black/30 backdrop-blur-md hover:bg-white hover:text-black transition-all hover:scale-105 shadow-xl">
                  اكتشف المجموعات
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories - Minimalist Grid */}
        <section className="py-24 container">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase relative inline-block">
              الأقسام
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
            <span className="text-xl text-muted-foreground font-light">اختر عالمك الخاص من مجموعاتنا المختارة</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.filter((c: any) => !c.parentId).slice(0, 4).map((cat: any) => (
              <Link key={cat.id} href={`/products?categorySlug=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-lg hover:shadow-xl transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getImageUrl(cat.imageUrl) || '/placeholder.png'} alt={cat.nameAr} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 right-6 text-white text-right">
                  <h3 className="text-2xl font-bold leading-tight">{cat.nameAr}</h3>
                  <p className="text-xs opacity-80 mt-1 uppercase tracking-wider">{cat.nameEn || 'Collection'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Moving Banner / Brand Values */}
        <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
          <div className="container grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-4 bg-white/10 rounded-full mb-2"><Sparkles className="w-8 h-8" /></div>
              <div>
                <h4 className="font-bold text-xl mb-1">جودة آسيوية</h4>
                <p className="text-sm opacity-90">سلالات نادرة ومميزة بأعلى المعايير العالمية</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-4 bg-white/10 rounded-full mb-2"><Leaf className="w-8 h-8" /></div>
              <div>
                <h4 className="font-bold text-xl mb-1">نباتات طبيعية</h4>
                <p className="text-sm opacity-90">تشكيلة واسعة من النباتات لأحواض أكثر جمالاً وحيوية</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="p-4 bg-white/10 rounded-full mb-2"><Fish className="w-8 h-8" /></div>
              <div>
                <h4 className="font-bold text-xl mb-1">صحة مضمونة</h4>
                <p className="text-sm opacity-90">رعاية بيطرية كاملة لضمان وصول الأسماك بصحة ممتازة</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products - Carousel Style */}
        <section className="py-24 container">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase relative inline-block">
              وصل حديثاً
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
            <span className="text-xl text-muted-foreground font-light">أحدث الإضافات إلى مجموعتنا الحصرية</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(product.media?.[0]?.url) || '/placeholder.png'}
                    alt={product.nameAr}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.stockQty <= 0 && (
                    <span className="absolute top-3 left-3 bg-white text-black px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm">نفذت الكمية</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{product.nameAr}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.category?.nameAr}</p>
                  <div className="pt-1 font-mono font-bold text-primary text-xl">
                    {Number(product.price).toLocaleString()} د.ع
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full px-12 py-6 text-lg border-2 font-bold hover:bg-foreground hover:text-background disabled:opacity-50 transition-all hover:scale-105">
                تصفح جميع المنتجات
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <footer className="bg-black text-white py-16 border-t border-white/10">
        <div className="container grid md:grid-cols-4 gap-12 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight">ASIAN FARM</h3>
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
              <li>بغداد، العراق</li>
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
        <div className="container mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
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

function Fish(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12c.94-2.08 2.3-4 4.5-5 2.5-1 6-1 8 0 4.5 2.5 4.5 9 1 10-2 .5-4.5.5-7 0-4-1-6.5-3.5-6.5-5Z" />
      <path d="M22 17c-.5-3-1-5-3-7" />
      <path d="M7 14c-1.5 1-3.5 2-5 2 2.5-1.5 2.8-5 5-4" />
      <path d="M12.5 8.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" />
    </svg>
  )
}
