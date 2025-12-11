import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Y-Link | Lyskontroll",
  description: "Profesjonell lyskontrollplattform under utvikling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="antialiased text-neutral-900">
        <div className="relative min-h-screen overflow-hidden bg-white bg-[radial-gradient(circle_at_20%_10%,#e9edf7_0,#e9edf7_30%,transparent_45%),radial-gradient(circle_at_80%_0%,#eef0ff_0,#eef0ff_25%,transparent_45%),radial-gradient(circle_at_50%_90%,#f1f5fb_0,#f1f5fb_25%,transparent_45%)]">
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
