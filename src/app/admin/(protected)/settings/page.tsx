"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, FolderTree, Settings as SettingsIcon, Save } from "lucide-react";
import { fetcher } from "@/lib/api";

type Category = {
    id: number;
    nameAr: string;
    nameEn?: string;
    slug: string;
    parentId?: number | null;
    children?: Category[];
    isActive: boolean;
    sortOrder: number;
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <SettingsIcon /> الإعدادات
            </h1>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === "categories" ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-white"}`}
                >
                    إدارة الأقسام
                </button>
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === "general" ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-white"}`}
                >
                    عام
                </button>
            </div>

            {/* Content */}
            <div className="pt-4">
                {activeTab === "categories" && <CategoriesManager />}
                {activeTab === "general" && <GeneralSettings />}
            </div>
        </div>
    );
}

function CategoriesManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        parentId: "null",
        slug: "",
        sortOrder: "0",
        imageUrl: "" // Add imageUrl
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetcher<Category[]>('/categories');
            setCategories(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                nameAr: category.nameAr,
                nameEn: category.nameEn || "",
                parentId: category.parentId?.toString() || "null",
                slug: category.slug,
                sortOrder: category.sortOrder.toString(),
                imageUrl: (category as any).imageUrl || "" // Cast only if TS complains, otherwise direct access
            });
        } else {
            setEditingCategory(null);
            setFormData({
                nameAr: "",
                nameEn: "",
                parentId: "null",
                slug: "",
                sortOrder: "0",
                imageUrl: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/media/upload`, {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: json.url }));
        } catch (err) {
            console.error("Upload failed", err);
            alert("فشل رفع الصورة");
        }
        setUploading(false);
    };

    // Helper for image URLs
    const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const generateSlug = (text: string) => {
                return text.trim().toLowerCase()
                    .replace(/[^\w\s-]/g, '') // Remove non-word chars (simple ascii check)
                    .replace(/\s+/g, '-') || `cat-${Date.now()}`; // Fallback
            };

            const finalSlug = formData.slug.trim() ||
                (formData.nameEn ? formData.nameEn.toLowerCase().replace(/\s+/g, '-') :
                    `category-${Date.now()}`); // Fallback for Arabic only if no slug provided

            const payload = {
                nameAr: formData.nameAr,
                nameEn: formData.nameEn,
                parentId: formData.parentId === "null" ? null : parseInt(formData.parentId),
                slug: finalSlug,
                sortOrder: parseInt(formData.sortOrder),
                imageUrl: formData.imageUrl
            };

            if (editingCategory) {
                await fetcher(`/categories/${editingCategory.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetcher('/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            setIsDialogOpen(false);
            loadCategories();
        } catch (e: any) {
            alert("حدث خطأ: " + (e.message || "فشل العملية"));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأقسام الفرعية أيضاً!")) return;
        try {
            await fetcher(`/categories/${id}`, { method: 'DELETE' });
            loadCategories();
        } catch (e) {
            alert("فشل الحذف");
        }
    };

    // Flatten for Select options
    const flatCategories: Category[] = [];
    const traverse = (cats: Category[]) => {
        cats.forEach(c => {
            flatCategories.push(c);
            if (c.children) traverse(c.children);
        });
    };
    traverse(categories);

    // Recursive render
    const renderCategoryRow = (cat: Category, depth = 0) => {
        return (
            <div key={cat.id}>
                <div className="flex items-center justify-between p-3 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-2" style={{ paddingRight: `${depth * 20}px` }}> {/* RTL padding */}
                        <FolderTree size={16} className={`text-zinc-500 ${depth === 0 ? 'text-primary' : ''}`} />
                        {(cat as any).imageUrl && (
                            <img src={getImageUrl((cat as any).imageUrl)} alt="" className="w-8 h-8 rounded object-cover border border-zinc-700 ml-2" />
                        )}
                        <span className="font-medium">{cat.nameAr}</span>
                        <span className="text-zinc-500 text-xs">({cat.slug})</span>
                        {cat.nameEn && <span className="text-zinc-600 text-xs">- {cat.nameEn}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => handleOpenDialog(cat)}>
                            <Edit size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                            <Trash size={14} />
                        </Button>
                    </div>
                </div>
                {cat.children?.map(child => renderCategoryRow(child, depth + 1))}
            </div>
        );
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>هيكلية الأقسام</CardTitle>
                    <CardDescription>قم بإضافة وتعديل الأقسام الرئيسية والفرعية التي تظهر في القوائم.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus size={16} /> إضافة قسم
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black/50">
                    {loading ? (
                        <div className="p-8 text-center text-zinc-500">جاري التحميل...</div>
                    ) : categories.length > 0 ? (
                        <div className="divide-y divide-zinc-800">
                            {categories.map(cat => renderCategoryRow(cat))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-zinc-500">لا توجد أقسام. ابدأ بإضافة قسم جديد.</div>
                    )}
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
                    </DialogHeader>
                    {/* Add key to form to force re-render on edit change */}
                    <form key={editingCategory ? editingCategory.id : 'new'} onSubmit={handleSubmit} className="space-y-4 py-4">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>صورة القسم</Label>
                            <div className="flex items-start gap-4">
                                <div className="h-20 w-20 rounded-md border border-zinc-700 bg-black flex items-center justify-center overflow-hidden relative group">
                                    {formData.imageUrl ? (
                                        <>
                                            <img src={getImageUrl(formData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <FolderTree className="text-zinc-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="bg-black text-xs file:text-white file:bg-zinc-800 file:border-0 file:rounded-md file:mr-2 file:px-2"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1">يفضل استخدام صور مربعة أو عمودية بنسبة 4:5.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>الاسم (عربي)</Label>
                                <Input required value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className="bg-black" />
                            </div>
                            <div className="space-y-2">
                                <Label>الاسم (إنجليزي)</Label>
                                <Input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="bg-black" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>الرابط (Slug)</Label>
                            <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="اختياري (يتم إنشاؤه تلقائياً)" className="bg-black text-xs font-mono" />
                        </div>

                        <div className="space-y-2">
                            <Label>القسم الرئيسي (الأب)</Label>
                            <Select value={formData.parentId} onValueChange={val => setFormData({ ...formData, parentId: val })}>
                                <SelectTrigger className="bg-black">
                                    <SelectValue placeholder="بدون (قسم رئيسي)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">-- بدون (قسم رئيسي) --</SelectItem>
                                    {flatCategories.filter(c => c.id !== editingCategory?.id).map(cat => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nameAr}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>الترتيب</Label>
                            <Input type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: e.target.value })} className="bg-black" />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={uploading}>{uploading ? "جاري الرفع..." : "حفظ التغييرات"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function GeneralSettings() {
    const [heroImage, setHeroImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/settings/hero_image`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.settingValue) {
                    setHeroImage(data.settingValue);
                }
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/media/upload`, {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            const url = json.url;
            setHeroImage(url);

            // Auto save
            await saveSetting('hero_image', url);
        } catch (err) {
            console.error("Upload failed", err);
            alert("فشل رفع الصورة");
        }
        setUploading(false);
    };

    const saveSetting = async (key: string, value: string) => {
        setLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
        } catch (e) {
            console.error(e);
            alert("فشل الحفظ");
        } finally {
            setLoading(false);
        }
    };

    // Helper for image URLs
    const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>إعدادات عامة</CardTitle>
                <CardDescription>تخصيص مظهر المتجر الرئيسي.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="space-y-4">
                    <Label className="text-lg font-semibold">صورة الغلاف الرئيسية (Hero Image)</Label>
                    <CardDescription>هذه الصورة تظهر في خلفية القسم العلوي في الصفحة الرئيسية.</CardDescription>

                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-[21/9] rounded-xl border border-zinc-700 bg-black overflow-hidden relative group">
                            {heroImage ? (
                                <>
                                    <img src={getImageUrl(heroImage)} alt="Hero Preview" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-bold text-white">معاينة</p>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                                    <SettingsIcon size={48} opacity={0.5} />
                                    <p>لا توجد صورة غلاف مخصصة (يتم استخدام الصورة الافتراضية)</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading || loading}
                                className="bg-black file:text-white file:bg-zinc-800 max-w-sm"
                            />
                            {uploading && <span className="text-sm text-yellow-500 animate-pulse">جاري الرفع والحفظ...</span>}
                            {!uploading && heroImage && <span className="text-sm text-green-500">تم الحفظ تلقائياً ✅</span>}
                        </div>
                        <p className="text-xs text-zinc-500">ينصح باستخدام صورة عالية الجودة بدقة 1920x1080 بكسل على الأقل.</p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
