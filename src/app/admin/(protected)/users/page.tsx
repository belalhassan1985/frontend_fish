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
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, Users, UserCog } from "lucide-react";
import { fetcher } from "@/lib/api";

type User = {
    id: number;
    email: string;
    name: string | null;
    role: string; // 'ADMIN' | 'USER'
    createdAt: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserRole(localStorage.getItem('admin_role'));
        }
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetcher<User[]>('/users');
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || "",
                email: user.email,
                password: "", // Don't show password
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "USER"
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (formData.password) {
                payload.password = formData.password;
            } else if (!editingUser) {
                alert("Please enter a password for new user");
                setSubmitting(false);
                return;
            }

            if (editingUser) {
                await fetcher(`/users/${editingUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetcher('/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            setIsDialogOpen(false);
            loadUsers();
        } catch (e: any) {
            alert("Error: " + (e.message || "Operation failed"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await fetcher(`/users/${id}`, { method: 'DELETE' });
            loadUsers();
        } catch (e) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users /> إدارة المستخدمين
            </h1>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>قائمة المستخدمين</CardTitle>
                        <CardDescription>إدارة حسابات المسؤولين والموظفين.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentUserRole === 'ADMIN' && (
                            <Button onClick={() => handleOpenDialog()} className="gap-2">
                                <Plus size={16} /> إضافة مستخدم
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black/50">
                        {loading ? (
                            <div className="p-8 text-center text-zinc-500">جاري التحميل...</div>
                        ) : users.length > 0 ? (
                            <div className="divide-y divide-zinc-800">
                                {users.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <UserCog size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.name || "مستخدم"}</p>
                                                <p className="text-sm text-zinc-500">{user.email}</p>
                                            </div>
                                            {user.role === 'ADMIN' && (
                                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30">مسؤول</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {currentUserRole === 'ADMIN' && (
                                                <>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => handleOpenDialog(user)}>
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => handleDelete(user.id)}>
                                                        <Trash size={14} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-zinc-500">لا يوجد مستخدمين.</div>
                        )}
                    </div>
                </CardContent>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>الاسم</Label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-black" placeholder="أحمد محمد" />
                            </div>
                            <div className="space-y-2">
                                <Label>البريد الإلكتروني</Label>
                                <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-black" placeholder="admin@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>كلمة المرور {editingUser && "(اتركها فارغة إذا لم ترد التغيير)"}</Label>
                                <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="bg-black" placeholder="********" />
                            </div>
                            <div className="space-y-2">
                                <Label>الصلاحية</Label>
                                <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })}>
                                    <SelectTrigger className="bg-black">
                                        <SelectValue placeholder="اختر الصلاحية" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">مستخدم عادي</SelectItem>
                                        <SelectItem value="ADMIN">مسؤول (Admin)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={submitting}>{submitting ? "جاري الحفظ..." : "حفظ"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}
