import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
// import { Footer } from "@/components/footer/footer";
import { NavComponent } from "@/components/nav/nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelMono = localFont({
  src: "../public/fonts/pixelpurl/font.ttf",
  variable: "--font-pixel-mono",
  weight: "300 400 500 600 700 800",
});

const jb = localFont({
  src: [
    {
      path: '../public/fonts/jb/regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/jb/medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/jb/bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/jb/extrabold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: "--font-jb",
});

export const metadata: Metadata = {
  title: "Techify AI",
  description: "Turn your business into a AI Driven Powerhouse | AI Technology | AI Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${inter.variable} ${pixelMono.variable} ${jb.variable} antialiased`}
      >
        <NavComponent />
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
