import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import WhatsAppWidget from "@/components/client/WhatsAppWidget";

export const metadata: Metadata = {
  title: {
    default: "Variety Vista — Jeans That Define You",
    template: "%s | Variety Vista",
  },
  description:
    "Shop the latest styles in men's and women's jeans — bootcut, baggy, straight, skinny, wide-leg, mom fit, and flare. Premium denim, delivered across India.",
  keywords: [
    "jeans",
    "denim",
    "bootcut jeans",
    "baggy jeans",
    "skinny jeans",
    "wide leg jeans",
    "mom jeans",
    "flare jeans",
    "men's jeans",
    "women's jeans",
    "buy jeans online India",
    "Variety Vista",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Variety Vista",
    title: "Variety Vista — Jeans That Define You",
    description:
      "Shop the latest styles in men's and women's jeans. Premium denim, delivered across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Variety Vista — Jeans That Define You",
    description:
      "Shop the latest styles in men's and women's jeans. Premium denim, delivered across India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", GeistSans.variable)}>
      <body className="font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://varietyvista.com/#organization",
                  "name": "Variety Vista",
                  "url": "https://varietyvista.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://varietyvista.com/icon.png"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://varietyvista.com/#website",
                  "url": "https://varietyvista.com",
                  "name": "Variety Vista",
                  "publisher": {
                    "@id": "https://varietyvista.com/#organization"
                  }
                }
              ]
            }),
          }}
        />
        <Analytics />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
