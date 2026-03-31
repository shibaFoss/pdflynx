import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "pdflynx | The Ultimate PDF Tools",
  description: "Merge, Split, Compress and Convert your PDF files with ease. Fast, secure, and loved by millions.",
  keywords: "pdf lynx, merge pdf, split pdf, compress pdf, pdf to image, image to pdf, free pdf tools",
  authors: [{ name: "pdflynx team" }],
  openGraph: {
    title: "pdflynx | Premium PDF Tools",
    description: "Fast, secure, and free PDF processing for everyone.",
    url: "https://pdflynx.com",
    siteName: "pdflynx",
    images: [{ url: "/og-image.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "pdflynx | Premium PDF Tools",
    description: "Fast, secure, and free PDF processing for everyone.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${ubuntuMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary scroll-smooth overflow-x-hidden`}
      >
        {/* Immersive Cyber Velvet Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] animate-float" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
        </div>

        <Header />
        <main className="flex-1 overflow-x-hidden pt-0 pb-0 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
