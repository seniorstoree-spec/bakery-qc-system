import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "نظام مراقبة جودة المخابز",
  description: "نظام يومي لضمان ومراقبة الجودة في قسم المخابز",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased h-screen flex overflow-hidden`}>
        <RoleProvider>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden w-full">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
              {children}
            </main>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
