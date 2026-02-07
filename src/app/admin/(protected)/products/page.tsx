"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await fetcher<any[]>('/products');
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
        try {
            await fetcher(`/products/${id}`, { method: 'DELETE' });
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            alert("فشل الحذف");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">المنتجات</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2 font-bold">
                        <Plus size={18} /> <span className="hidden md:inline">إضافة منتج جديد</span><span className="md:hidden">إضافة</span>
                    </Button>
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="bg-zinc-900 border-b border-zinc-800 font-bold">
                        <tr>
                            <th className="p-4">الصورة</th>
                            <th className="p-4">الاسم</th>
                            <th className="p-4">القسم</th>
                            <th className="p-4">السعر</th>
                            <th className="p-4">المخزون</th>
                            <th className="p-4 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-black/50">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="p-4">
                                    <div className="h-16 w-16 rounded bg-white/5 overflow-hidden border border-zinc-700">
                                        {product.media?.[0]?.url && (
                                            <img
                                                src={product.media[0].url.startsWith('http') ? product.media[0].url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${product.media[0].url}`}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium">{product.nameAr}<br /><span className="text-zinc-500 text-xs">{product.nameEn}</span></td>
                                <td className="p-4 text-zinc-400">{product.category?.nameAr}</td>
                                <td className="p-4 font-bold text-primary">{Number(product.price).toLocaleString()} د.ع</td>
                                <td className="p-4">{product.stockQty}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white"><Edit size={16} /></Button>
                                        </Link>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-zinc-500">لا توجد منتجات حتى الآن</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map(product => (
                    <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-4">
                        <div className="h-24 w-24 shrink-0 rounded bg-white/5 overflow-hidden border border-zinc-700">
                            {product.media?.[0]?.url && (
                                <img
                                    src={product.media[0].url.startsWith('http') ? product.media[0].url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${product.media[0].url}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg leading-tight truncate">{product.nameAr}</h3>
                                <p className="text-xs text-zinc-500 truncate mb-1">{product.nameEn}</p>
                                <p className="text-xs text-zinc-400">{product.category?.nameAr}</p>
                            </div>
                            <div className="flex items-end justify-between mt-2">
                                <div>
                                    <span className="font-bold text-primary text-lg">{Number(product.price).toLocaleString()}</span> <span className="text-xs text-zinc-500">د.ع</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/products/${product.id}`}>
                                        <Button size="icon" variant="outline" className="h-8 w-8 border-zinc-700"><Edit size={14} /></Button>
                                    </Link>
                                    <Button size="icon" variant="outline" className="h-8 w-8 border-zinc-700 text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => handleDelete(product.id)}><Trash size={14} /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && products.length === 0 && (
                    <div className="text-center p-8 text-zinc-500 border border-zinc-800 rounded-xl">لا توجد منتجات</div>
                )}
            </div>
        </div>
    );
}
