import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Providers } from "./providers";
  import "./globals.css";
  import ConfigButton from "@/components/configButton";
const cabinetGrotesk = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${cabinetGrotesk.variable} ${manrope.variable} font-manrope`}
        suppressHydrationWarning
      >
        <Providers>
          <NextIntlClientProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" closeButton />
            <ConfigButton />
            <ConditionalNavbar />
            {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}