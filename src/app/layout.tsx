import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // Update with your actual domain
  title: {
    default: "Frosh CodeOrbit | Web & Software Developer",
    template: "%s | Frosh CodeOrbit",
  },
  description: "Professional portfolio of Umanor Wisdom - Full-Stack Web & Software Developer specializing in Next.js, React, and Supabase.",
  keywords: ["Web Developer", "Software Engineer", "Next.js", "React", "Supabase", "Portfolio", "Umanor Wisdom"],
  authors: [{ name: "Umanor Wisdom" }],
  creator: "Umanor Wisdom",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Frosh CodeOrbit | Web & Software Developer",
    description: "Professional portfolio of Umanor Wisdom - Full-Stack Web & Software Developer.",
    siteName: "Frosh CodeOrbit",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "Frosh CodeOrbit Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frosh CodeOrbit | Web & Software Developer",
    description: "Professional portfolio of Umanor Wisdom - Full-Stack Web & Software Developer.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
