import type { Metadata } from "next";
import { Inter, Rajdhani, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/providers/theme-provider";

// Font Setup
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Compunor | Hardware & Gaming",
  description:
    "La mejor tecnología gamer en Tucumán. Armado de PC, periféricos y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rajdhani.variable} ${montserrat.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Skip Link for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gamer-red focus:text-white focus:rounded-lg focus:font-bold"
          >
            Saltar al contenido principal
          </a>
          <Navbar />
          <main id="main-content" className="pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
