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
                <h1 className="text-3xl font-bold">المنتجات</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2 font-bold">
                        <Plus size={18} /> إضافة منتج جديد
                    </Button>
                </Link>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden">
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
                                    <div className="h-20 w-20 rounded bg-white/5 overflow-hidden border border-zinc-700">
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
        </div>
    );
}
