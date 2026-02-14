"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, PlusCircle, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Check auth client-side as double protection and for hydration
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && pathname !== "/admin/login") {
                router.push("/admin/login");
            }
            setLoading(false);
        };
        checkUser();
    }, [router, pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/dashboard"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/projects"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/projects" || pathname.includes("/admin/projects")
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <FileText size={20} />
                        Projects
                    </Link>
                    <Link
                        href="/admin/projects/new"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/projects/new"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <PlusCircle size={20} />
                        Add Project
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
