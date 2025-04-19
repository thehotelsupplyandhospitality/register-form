import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Supply & Hospitality Expo",
  description: "Join the Hotel Supply & Hospitality Expo Saudi Arabia 2025 – Saudi Arabia's leading event for hotel supplies, hospitality solutions, and F&B innovations. Explore strategic sponsorship packages, exhibitor benefits, and networking opportunities in Jeddah.",
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        
        <script
          src="https://www.google.com/recaptcha/api.js?render=6LczrR0rAAAAAOgAYqgFiME6l-Sl5bs1ErIKJQla"
          async
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
