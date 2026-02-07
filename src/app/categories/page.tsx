import { Header } from "@/components/layout/header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getCategories() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/categories`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();
    const mainCategories = categories.filter((c: any) => !c.parentId);

    // Helper for image URLs
    const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground">
            <Header />
            <main className="flex-1 container py-16">

                <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase">Collections</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase relative inline-block">
                        أقسام المتجر
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full"></span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto pt-4">
                        اكتشف مجموعاتنا المميزة من أسماك الزينة النادرة والنباتات المائية ومستلزمات العناية المتكاملة.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainCategories.map((cat: any, idx: number) => (
                        <Link
                            key={cat.id}
                            href={`/products?categorySlug=${cat.slug}`}
                            className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted shadow-2xl hover:shadow-3xl transition-all duration-500"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageUrl(cat.imageUrl) || '/placeholder.png'}
                                alt={cat.nameAr}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h2 className="text-4xl font-bold mb-2 leading-none">{cat.nameAr}</h2>
                                    <p className="text-sm opacity-70 uppercase tracking-widest font-semibold mb-4">{cat.nameEn}</p>

                                    {/* Children Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {cat.children?.slice(0, 3).map((child: any) => (
                                            <span key={child.id} className="text-[10px] border border-white/20 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                                                {child.nameAr}
                                            </span>
                                        ))}
                                        {cat.children?.length > 3 && <span className="text-[10px] px-2 py-1 text-white/60">+{cat.children.length - 3}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                        تصفح القسم <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>

            <footer className="bg-black text-white py-16 border-t border-white/10">
                <div className="container grid md:grid-cols-4 gap-12 text-center md:text-right">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black tracking-tight">ASIAN FARM CENTER</h3>
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
                <div className="container mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2026 مركز المزرعة الآسيوية. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
                        <Link href="#" className="hover:text-white transition-colors">شروط الاستخدام</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import { Button } from "@/components/ui/button";
