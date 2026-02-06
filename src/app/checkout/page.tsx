"use client";

import { Header } from "@/components/layout/header";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

export default function CheckoutPage() {
    const cart = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
        note: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.items.length === 0) return;
        setLoading(true);

        try {
            const payload = {
                ...formData,
                items: cart.items.map(i => ({ productId: i.productId, qty: i.qty }))
            };

            const res = await fetcher<any>('/orders', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Clear cart
            cart.clearCart();

            // Redirect to WhatsApp
            if (res.whatsappUrl) {
                window.location.href = res.whatsappUrl;
            } else {
                alert('تم الطلب بنجاح رقم: ' + res.orderNumber);
                router.push('/');
            }

        } catch (err: any) {
            alert(err.message || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold">السلة فارغة</h2>
                    <Button onClick={() => router.push('/products')}>تصفح المنتجات</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader><CardTitle>ملخص الطلب</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {cart.items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                    <span>{item.name} × {item.qty}</span>
                                    <span className="font-medium">{(item.price * item.qty).toLocaleString()} د.ع</span>
                                </div>
                            ))}
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>المجموع</span>
                                <span>{cart.totalPrice().toLocaleString()} د.ع</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form */}
                    <Card>
                        <CardHeader><CardTitle>معلومات التوصيل</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم الثلاثي</Label>
                                    <Input id="name" required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} placeholder="الاسم الكامل" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input id="phone" required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="07xxxxxxxxx" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">العنوان الكامل</Label>
                                    <Input id="address" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="المحافظة - المنطقة - قرب نقطة دالة" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="note">ملاحظات (اختياري)</Label>
                                    <Textarea id="note" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder="أي تعليمات إضافية" />
                                </div>

                                <Button type="submit" size="lg" className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                                    {loading ? 'جاري الطلب...' : 'تأكيد الطلب عبر واتساب'}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    سيتم تحويلك إلى واتساب لإرسال تفاصيل الطلب تلقائياً.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
