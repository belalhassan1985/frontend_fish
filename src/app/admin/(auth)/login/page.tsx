"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { fetcher } from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetcher<any>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            if (res.success) {
                // Determine if window is defined (client-side)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('admin_token', res.accessToken);
                    localStorage.setItem('admin_role', res.user.role);
                }
                router.push('/admin/dashboard');
            } else {
                setError("Login failed");
            }
        } catch (err: any) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-zinc-800 p-4 rounded-full w-fit mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Username</label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-black border-zinc-700 focus:border-primary text-white"
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black border-zinc-700 focus:border-primary text-white"
                                placeholder="Enter password"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full font-bold" size="lg" disabled={loading}>
                            {loading ? "Authenticating..." : "Login to Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
