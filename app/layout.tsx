import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import Sidebar from "@/components/Sidebar";
import Script from "next/script";
import SessionWrapper from "@/components/SessionWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Code Buddy",
  description: "Your smart assistant for cleaner, faster, and safer code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-wrap h-screen w-screen  suppressHydrationWarning overflow-auto no-scrollbar` }
       
      >
        <SessionWrapper>
          <Providers>
            <Sidebar />
            {children}
          </Providers>
        </SessionWrapper>
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        />
      </body>
       
    </html>
  );
}
