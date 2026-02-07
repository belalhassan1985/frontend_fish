"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, Settings, LogOut, Menu, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    if (!authorized) return null;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="mb-10 flex items-center gap-2 font-bold text-xl px-2">
                <span className="text-primary">لوحة</span> التحكم
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem href="/admin/dashboard" icon={<Home size={20} />} label="نظرة عامة" active={pathname === '/admin/dashboard'} />
                <NavItem href="/admin/products" icon={<Package size={20} />} label="المنتجات" active={pathname.startsWith('/admin/products')} />
                <NavItem href="/admin/users" icon={<Users size={20} />} label="المستخدمين" active={pathname.startsWith('/admin/users')} />
                <NavItem href="/admin/settings" icon={<Settings size={20} />} label="الإعدادات" active={pathname.startsWith('/admin/settings')} />
            </nav>

            <button
                onClick={() => {
                    localStorage.removeItem('admin_token');
                    router.push('/admin/login');
                }}
                className="flex items-center gap-3 text-zinc-400 hover:text-red-400 transition-colors mt-auto px-2 py-2"
            >
                <LogOut size={20} />
                <span>تسجيل خروج</span>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans" dir="rtl">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
                <div className="font-bold text-lg"><span className="text-primary">لوحة</span> التحكم</div>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-zinc-950 border-zinc-800 text-white w-[280px] p-6">
                        <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-l border-zinc-800 p-6 flex-col sticky top-0 h-screen overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                ? "bg-primary/10 text-primary font-bold"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
