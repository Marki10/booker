import type { Metadata, Viewport } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Booking App - Manage your appointments easily",
  description: "Booking App - Manage your appointments easily",
  keywords: ["booking", "appointments", "scheduling", "calendar"],
  authors: [{ name: "Booking App" }],
  openGraph: {
    title: "Booking App",
    description: "Manage your appointments easily",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Booking App",
  description: "Manage your appointments easily",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
