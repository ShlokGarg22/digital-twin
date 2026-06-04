import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Twin",
  description: "Your digital twin chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} h-full antialiased`}
    >
      <body style={{ fontFamily: 'var(--font-kalam), cursive' }} className="min-h-full flex flex-col text-xl tracking-wide">{children}</body>
    </html>
  );
}
