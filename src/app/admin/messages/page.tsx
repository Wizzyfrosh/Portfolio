"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Mail, Calendar, User, MessageSquare, Trash2, Search } from "lucide-react";

interface Message {
    id: number;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read?: boolean; // Optional, if you add this field later
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const { error } = await supabase
                .from("contact_messages")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message");
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-500 mt-1">View and manage inquiries from your contact form.</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse h-48"></div>
                    ))}
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No messages found</h3>
                    <p className="text-gray-500 mt-2">Your inbox is empty or no messages match your search.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMessages.map((msg) => (
                        <div key={msg.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={14} />
                                        <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Delete message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1" title={msg.subject}>{msg.subject}</h3>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <User size={16} className="text-blue-500" />
                                    <span className="font-medium">{msg.name}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg break-all">
                                    <Mail size={14} />
                                    {msg.email}
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                    {msg.message}
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 mt-auto">
                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                >
                                    <Mail size={16} />
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
