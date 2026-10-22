import { Bitter, Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const bitter = Bitter({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-head",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Website Catatan Sosial",
  description: "Aplikasi catatan sosial sederhana dengan desain glassmorphism.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${bitter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body text-[var(--ink)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
