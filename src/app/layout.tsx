import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/common/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LGTM Generator - Create Beautiful LGTM Images",
  description:
    "Generate beautiful LGTM (Looks Good To Me) images for code reviews and pull requests. Choose from multiple templates, customize colors, fonts, and download instantly.",
  keywords: ["LGTM", "code review", "pull request", "GitHub", "image generator", "developer tools"],
  authors: [{ name: "LGTM Generator" }],
  openGraph: {
    title: "LGTM Generator",
    description: "Create beautiful LGTM images for code reviews",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LGTM Generator",
    description: "Create beautiful LGTM images for code reviews",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
