import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Aangan | Verified Real Estate & Properties in Kolhapur",
  description: "Find your dream home in Kolhapur. Explore verified apartments, villas, and plots with Aangan's premium property marketplace.",
};

import { PostHogProvider } from "@/components/providers/PostHogProvider";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="antialiased">
        <PostHogProvider>
          <AuthProvider>
            {children}
            <VoiceAssistant />
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
