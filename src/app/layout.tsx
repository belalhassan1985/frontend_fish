import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // or IBM Plex Sans Arabic
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const font = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  metadataBase: new URL('https://asianfarmcenter.com'),
  title: {
    default: "مركز المزرعة الآسيوية | Asian Farm Center",
    template: "%s | مركز المزرعة الآسيوية"
  },
  description: "وجهتك الأولى لأسماك الزينة والنباتات المائية ومستلزمات الأحواض في العراق. نجمع بين الفن والطبيعة.",
  keywords: ["أسماك زينة", "أحواض سمك", "نباتات مائية", "مستلزمات أحواض", "بغداد", "العراق", "Asian Farm Center", "Aquarium"],
  authors: [{ name: "Asian Farm Center" }],
  creator: "Asian Farm Center",
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: "https://asianfarmcenter.com",
    title: "مركز المزرعة الآسيوية | Asian Farm Center",
    description: "وجهتك الأولى لأسماك الزينة والنباتات المائية ومستلزمات الأحواض في العراق.",
    siteName: "Asian Farm Center",
    images: [
      {
        url: "/og-image.jpg", // We need to ensure this image exists or use a logo
        width: 1200,
        height: 630,
        alt: "Asian Farm Center"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "مركز المزرعة الآسيوية | Asian Farm Center",
    description: "وجهتك الأولى لأسماك الزينة والنباتات المائية ومستلزمات الأحواض في العراق.",
    images: ["/og-image.jpg"], // Same here
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", font.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
