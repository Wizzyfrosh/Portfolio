import { PlusCircle, BookOpen, MessageSquare, Briefcase, ExternalLink, ArrowRight } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        blogs: 0,
        messages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const [projectsRes, blogsRes, messagesRes] = await Promise.all([
                supabase.from("projects").select("*", { count: "exact", head: true }),
                supabase.from("blogs").select("*", { count: "exact", head: true }),
                supabase.from("contact_messages").select("*", { count: "exact", head: true }),
            ]);

            setStats({
                projects: projectsRes.count || 0,
                blogs: blogsRes.count || 0,
                messages: messagesRes.count || 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Total Projects", value: stats.projects, icon: <Briefcase size={24} />, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/projects" },
        { label: "Blog Posts", value: stats.blogs, icon: <BookOpen size={24} />, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/blog" },
        { label: "Messages", value: stats.messages, icon: <MessageSquare size={24} />, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/messages" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">Here&apos;s an overview of your portfolio performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ExternalLink size={18} />
                        View Live Site
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <Link
                        key={i}
                        href={stat.href}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                <ArrowRight size={20} />
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/projects/new"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all text-gray-700 hover:text-blue-600"
                    >
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100">
                            <PlusCircle size={20} />
                        </div>
                        <span className="font-semibold">Add New Project</span>
                    </Link>
                    <Link
                        href="/admin/blog/new"
                        className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:bg-purple-50/50 hover:border-purple-100 transition-all text-gray-700 hover:text-purple-600"
                    >
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-purple-100">
                            <PlusCircle size={20} />
                        </div>
                        <span className="font-semibold">New Blog Post</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
