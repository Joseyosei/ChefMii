import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChefMii - Hire a Chef for Any Occasion",
  description:
    "From home dinners to presidential banquets, ChefMii connects you with top chefs globally. Book exceptional dining experiences on demand.",
  openGraph: {
    title: "ChefMii - Hire a Chef for Any Occasion",
    description:
      "From home dinners to presidential banquets, ChefMii connects you with top chefs globally.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e0641e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
