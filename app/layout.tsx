import type { Metadata, Viewport } from "next";
import "@fontsource/pixelify-sans/latin-500.css";
import "@fontsource/pixelify-sans/latin-700.css";
import "@fontsource/oxanium/latin-400.css";
import "@fontsource/oxanium/latin-600.css";
import "@fontsource/oxanium/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohit Boora — Student Developer",
  description:
    "Portfolio of Mohit Boora, 2nd year B.Tech Computer Science student at Shoolini University.",
};

export const viewport: Viewport = {
  themeColor: "#030805",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
