"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { LayoutDashboard, PlusCircle, LogOut, FileText, Menu, X, User, BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check auth state change for robust redirection
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && pathname !== "/admin/login") {
                router.push("/admin/login");
            }
            setLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || (!session && pathname !== '/admin/login')) {
                router.push('/admin/login');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Force full reload to clear any server-side cookies/cache issues
        window.location.href = "/admin/login";
    };

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-600 focus:outline-none"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:min-h-screen",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                    <Link
                        href="/admin/blog"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/blog" || pathname.includes("/admin/blog")
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <BookOpen size={20} />
                        Blog
                    </Link>
                    <Link
                        href="/admin/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/profile"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <User size={20} />
                        Profile
                    </Link>
                    <Link
                        href="/admin/messages"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                            pathname === "/admin/messages" || pathname.includes("/admin/messages")
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <MessageSquare size={20} />
                        Messages
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
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
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
