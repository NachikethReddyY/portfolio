import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nachiketh Reddy | Frontend Developer",
  description: "Portfolio of Nachiketh Reddy, a Frontend Developer based in Singapore.",
};

import { BubbleMenu } from "@/components/ui/bubble-menu";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#f5f5f5]`}>
        <BubbleMenu
          useFixedPosition
          logo={
            <div className="h-10 w-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="NR"
                width={40}
                height={40}
                className="object-cover h-full w-full"
              />
            </div>
          }
          className="top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50"
        />
        {children}
      </body>
    </html>
  );
}
