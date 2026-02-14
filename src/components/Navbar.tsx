"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "My Projects", href: "#projects" },
    { name: "About Me", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
                scrolled ? "shadow-md py-4" : "py-6"
            )}
        >
            <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold tracking-tight text-gray-900">
                    it&apos;s <span className="text-gray-900 border-b-4 border-transparent">me</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-800 hover:text-blue-600 font-semibold transition-colors text-[15px]"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/resume"
                        className="px-5 py-2 border-2 border-gray-900 text-gray-900 font-semibold rounded-md hover:bg-gray-900 hover:text-white transition-all duration-300 text-[15px]"
                    >
                        Resume
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white border-t"
                >
                    <div className="flex flex-col p-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/resume"
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Resume
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
