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
          className="top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
