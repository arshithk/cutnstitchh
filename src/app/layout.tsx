import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import TextileSimulation from "@/components/TextileSimulation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Cut n Stitch Apparel | Premium B2B Apparel Manufacturing",
  description: "Cut n Stitch Apparel is a leading B2B apparel manufacturer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-transparent">
            <TextileSimulation />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,156,114,0.08),transparent_45%)]" />
          </div>

          <div className="relative z-10">
            {children}
            <FloatingWhatsApp />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}