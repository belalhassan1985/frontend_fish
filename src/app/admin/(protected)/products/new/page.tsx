"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Video, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/api";
import { extractYoutubeId } from "@/lib/youtube";

type Category = { id: number; nameAr: string; children?: Category[] };

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        price: "",
        stockQty: "",
        categoryId: "",
        description: "",
        sku: "",
    });

    // Media State
    const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
    const [video, setVideo] = useState<{ url: string; type: 'FILE' | 'YOUTUBE' } | null>(null);
    const [videoInputType, setVideoInputType] = useState<'FILE' | 'YOUTUBE'>('FILE');

    useEffect(() => {
        fetcher<Category[]>('/categories').then(setCategories);
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const files = Array.from(e.target.files);

        // Upload each file
        for (const file of files) {
            const data = new FormData();
            data.append('file', file);
            try {
                // We use fetch directly for FormData
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/media/upload`, {
                    method: 'POST',
                    body: data,
                });
                const json = await res.json();
                // Ensure URL is handled correctly
                setImages(prev => [...prev, { url: json.url, file }]);
            } catch (err) {
                console.error("Upload failed", err);
                alert("فشل رفع الصورة");
            }
        }
        setUploading(false);
    };

    // Helper to resolve URL
    const getMediaUrl = (url: string) => url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        // Validation: 15s check is hard on client without loading metadata, 
        // usually size check is easier. Let's limit to 50MB roughly.
        if (file.size > 50 * 1024 * 1024) {
            alert("حجم الفيديو كبير جداً. الحد الأقصى 50 ميجابايت.");
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/media/upload`, {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            setVideo({ url: json.url, type: 'FILE' });
        } catch (err) {
            console.error("Video upload failed", err);
            alert("فشل رفع الفيديو");
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Generate Slug
            const generatedSlug = (formData.nameEn || formData.nameAr || `product-${Date.now()}`)
                .trim()
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-') || `product-${Date.now()}`;

            // Construct Payload
            const payload = {
                nameAr: formData.nameAr,
                nameEn: formData.nameEn,
                slug: generatedSlug,
                description: formData.description,
                price: parseFloat(formData.price),
                stockQty: parseInt(formData.stockQty),
                sku: formData.sku,
                categoryId: parseInt(formData.categoryId),
                media: {
                    create: [
                        ...images.map((img, idx) => ({
                            url: img.url,
                            mediaType: "IMAGE",
                            displayOrder: idx,
                            isPrimary: idx === 0
                        })),
                        ...(video ? [{
                            url: video.type === 'FILE' ? video.url : undefined,
                            youtubeVideoId: video.type === 'YOUTUBE' ? extractYoutubeId(video.url) : undefined,
                            mediaType: video.type === 'YOUTUBE' ? "YOUTUBE" : "VIDEO",
                            displayOrder: 99
                        }] : [])
                    ]
                }
            };

            const res = await fetcher<any>('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            alert("تم إضافة المنتج بنجاح!");
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.message || "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    // Flatten categories for select
    const flatCategories: Category[] = [];
    const traverse = (cats: Category[]) => {
        cats.forEach(c => {
            flatCategories.push(c);
            if (c.children) traverse(c.children);
        });
    };
    traverse(categories);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>اسم المنتج (عربي)</Label>
                                <Input required value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className="bg-black" />
                            </div>
                            <div className="space-y-2">
                                <Label>Product Name (English)</Label>
                                <Input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="bg-black" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>السعر (د.ع)</Label>
                                <Input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="bg-black" />
                            </div>
                            <div className="space-y-2">
                                <Label>الكمية المتوفرة</Label>
                                <Input type="number" required value={formData.stockQty} onChange={e => setFormData({ ...formData, stockQty: e.target.value })} className="bg-black" />
                            </div>
                            <div className="space-y-2">
                                <Label>القسم</Label>
                                <Select onValueChange={val => setFormData({ ...formData, categoryId: val })}>
                                    <SelectTrigger className="bg-black">
                                        <SelectValue placeholder="اختر القسم" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {flatCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nameAr}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>الوصف</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-black min-h-[100px]" />
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 space-y-6">
                        {/* Images */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ImageIcon className="text-primary" /> صور المنتج
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    يفضل صور مربعة بمقاس <strong>800x800 بكسل</strong>. الحد الأقصى 2 ميجابايت للصورة.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group">
                                        <img src={getMediaUrl(img.url)} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        {i === 0 && <span className="absolute bottom-0 inset-x-0 bg-primary/80 text-white text-xs text-center py-1">الرئيسية</span>}
                                    </div>
                                ))}

                                <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-primary hover:bg-zinc-800 transition-colors flex flex-col items-center justify-center cursor-pointer">
                                    <Upload className="mb-2 text-zinc-500" />
                                    <span className="text-xs text-zinc-400">تحميل صور</span>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="h-px bg-zinc-800" />

                        {/* Video */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Video className="text-primary" /> فيديو توضيحي
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    يمكنك رفع فيديو قصير (15 ثانية) أو وضع رابط يوتيوب.
                                </p>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <Button
                                    type="button"
                                    variant={videoInputType === 'FILE' ? "default" : "outline"}
                                    onClick={() => setVideoInputType('FILE')}
                                    className="gap-2"
                                >
                                    <Upload size={16} /> رفع من الجهاز
                                </Button>
                                <Button
                                    type="button"
                                    variant={videoInputType === 'YOUTUBE' ? "default" : "outline"}
                                    onClick={() => setVideoInputType('YOUTUBE')}
                                    className="gap-2"
                                >
                                    <Video size={16} /> رابط يوتيوب
                                </Button>
                            </div>

                            {video ? (
                                <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-black aspect-video max-w-md">
                                    {video.type === 'FILE' ? (
                                        <video src={video.url} controls className="w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-500">فيديو يوتيوب: {video.url}</div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setVideo(null)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {videoInputType === 'FILE' ? (
                                        <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-zinc-700 rounded-lg hover:border-primary hover:bg-zinc-800 transition-colors cursor-pointer">
                                            <Upload className="mb-2 text-zinc-500" />
                                            <span className="text-sm text-zinc-400">اختر ملف فيديو (MP4)</span>
                                            <span className="text-xs text-zinc-600 mt-1">الحد الأقصى 15 ثانية</span>
                                            <input type="file" accept="video/mp4" onChange={handleVideoUpload} className="hidden" />
                                        </label>
                                    ) : (
                                        <div className="flex gap-2 max-w-md">
                                            <Input
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="bg-black"
                                                onBlur={(e) => {
                                                    if (e.target.value) setVideo({ url: e.target.value, type: 'YOUTUBE' })
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>إلغاء</Button>
                    <Button type="submit" disabled={loading || uploading} size="lg" className="w-32">
                        {loading ? <Loader2 className="animate-spin" /> : "حفظ المنتج"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
