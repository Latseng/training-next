import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Training-next",
  description: "Train for yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-noto-sans-tc antialiased`}
      >
        <header className="p-4 m-4 md:m-0 border rounded-lg md:rounded-none">
          <Link href="/" className="hover:bg-gray-100">
             Training
          </Link>
        </header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
