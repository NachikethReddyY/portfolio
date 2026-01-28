import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nachiketh Reddy | Full Stack Developer in Singapore",
    template: "%s | Nachiketh Reddy"
  },
  description: "Portfolio of Nachiketh Reddy, a Full Stack Developer based in Singapore specializing in Next.js, React, and modern web systems.",
  keywords: ["Nachiketh Reddy", "Full Stack Developer", "Singapore", "Frontend Developer", "Next.js", "React", "Node.js", "Web Development", "Software Engineer"],
  authors: [{ name: "Nachiketh Reddy" }],
  creator: "Nachiketh Reddy",
  publisher: "Nachiketh Reddy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ynr.vercel.app"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "googlea94d6c0964e8d3d9",
  },
  openGraph: {
    title: "Nachiketh Reddy | Full Stack Developer in Singapore",
    description: "Verified portfolio of Nachiketh Reddy. Building practical web systems with APIs and clean architecture.",
    url: "https://ynr.vercel.app",
    siteName: "Nachiketh Reddy Portfolio",
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: "https://ynr.vercel.app/mesquare.png", // Using absolute URL for better compatibility
        width: 800,
        height: 800,
        alt: "Nachiketh Reddy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nachiketh Reddy | Full Stack Developer",
    description: "Based in Singapore. Building modern web systems.",
    images: ["https://ynr.vercel.app/mesquare.png"],
    creator: "@NachikethReddyY",
  },
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    "ICBM": "1.3521, 103.8198",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nachiketh Reddy",
  "jobTitle": "Full Stack Developer",
  "url": "https://ynr.vercel.app",
  "image": "https://ynr.vercel.app/mesquare.png",
  "homeLocation": {
    "@type": "Place",
    "name": "Singapore"
  },
  "sameAs": [
    "https://linkedin.com/in/ynr-nachiketh-reddy",
    "https://github.com/NachikethReddyY"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Singapore Polytechnic"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Singapore Polytechnic"
  }
};

import { BubbleMenu } from "@/components/ui/bubble-menu";
import Image from "next/image";

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BubbleMenu
            useFixedPosition
            logo={
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="/mesquare.png"
                  alt="NR"
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              </div>
            }
            className="top-4 right-4 md:right-8 z-50"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <footer className="py-12 text-center text-sm text-muted-foreground border-t border-zinc-200/50 bg-[#f5f5f5] dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 space-y-2">
              <p className="font-medium">&copy; {new Date().getFullYear()} Nachiketh Reddy.</p>
              <p className="text-xs text-zinc-400 uppercase tracking-widest">Built for documentation of work and display.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
