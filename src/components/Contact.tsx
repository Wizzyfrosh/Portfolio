"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Facebook, Phone, Send, CheckCircle, AlertCircle, User, AtSign, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

const socialLinks = [
    { icon: <Mail size={20} />, href: "mailto:umanorwisdom55@gmail.com", label: "Email", color: "hover:bg-red-500 hover:border-red-500" },
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/Frosh.Dev", label: "Facebook", color: "hover:bg-blue-600 hover:border-blue-600" },
    { icon: <Phone size={20} />, href: "https://wa.me/qr/2GI33RJFBUI3K1", label: "WhatsApp", color: "hover:bg-green-500 hover:border-green-500" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/umanor-wisdom-b2699a318?utm_source=share_via&utm_content=profile&utm_medium=member_android", label: "LinkedIn", color: "hover:bg-blue-700 hover:border-blue-700" },
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const { error } = await supabase
                .from("contact_messages")
                .insert([formData]);

            if (error) throw error;

            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 5000);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "Something went wrong. Please try again.");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section id="contact" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center gap-4 mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight whitespace-nowrap">
                        LET&apos;S CONNECT
                    </h2>
                    <div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="grid md:grid-cols-5 gap-12">
                    {/* Left: Info & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Get In Touch
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                            Have a project in mind or want to collaborate? Feel free to reach out.
                            I&apos;m always open to discussing new opportunities and ideas.
                        </p>

                        <div className="mb-8">
                            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                                Find me on
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        title={link.label}
                                        className={`w-11 h-11 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center transition-all duration-300 hover:text-white hover:-translate-y-1 ${link.color}`}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-3"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                {/* Name */}
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                {/* Email */}
                                <div className="relative">
                                    <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your Email"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="relative">
                                <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Subject"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div className="relative">
                                <MessageSquare size={16} className="absolute left-4 top-4 text-gray-400" />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    required
                                    rows={5}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>

                            {/* Success/Error Feedback */}
                            {status === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400"
                                >
                                    <CheckCircle size={20} />
                                    <span className="font-medium">Message sent successfully! I&apos;ll get back to you soon.</span>
                                </motion.div>
                            )}
                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
                                >
                                    <AlertCircle size={20} />
                                    <span className="font-medium">{errorMsg}</span>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
