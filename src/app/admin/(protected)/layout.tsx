"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Package, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-black text-white flex font-sans" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 border-l border-zinc-800 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-2 font-bold text-xl">
                    <span className="text-primary">لوحة</span> التحكم
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem href="/admin/dashboard" icon={<Home size={20} />} label="نظرة عامة" />
                    <NavItem href="/admin/products" icon={<Package size={20} />} label="المنتجات" />
                    <NavItem href="/admin/settings" icon={<Settings size={20} />} label="الإعدادات" />
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem('admin_token');
                        router.push('/admin/login');
                    }}
                    className="flex items-center gap-3 text-zinc-400 hover:text-red-400 transition-colors mt-auto"
                >
                    <LogOut size={20} />
                    <span>تسجيل خروج</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: any) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
            {icon}
            <span>{label}</span>
        </Link>
    )
}
