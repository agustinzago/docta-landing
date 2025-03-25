import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Source_Sans_3, Manrope } from "next/font/google";
import { siteDetails } from '@/data/siteDetails';

import "./globals.css";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "sonner";
import { BillingProvider } from "@/providers/billing-provider";
import { Providers } from "@/providers/providers";
import { AuthProvider } from "@/contexts/AuthContext";

const manrope = Manrope({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  metadataBase: new URL(siteDetails.siteUrl),
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: 'website',
    images: [
      {
        url: '/images/opengraph.png',
        width: 1200,
        height: 630,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: ['/images/opengraph.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${manrope.className} ${sourceSans.className} antialiased`}>
          {siteDetails.googleAnalyticsId && <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />}
          <AuthProvider>
            <BillingProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </BillingProvider>
              <Toaster />
          </AuthProvider>
        </body>
      </html>
  );
}