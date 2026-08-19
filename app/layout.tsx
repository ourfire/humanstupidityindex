import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-archivo",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const description =
  "A public instrument that reports one number: how stupid the human species is behaving right now, as a collective.";

export const metadata: Metadata = {
  metadataBase: new URL("https://humanstupidityindex.org"),
  title: "Human Stupidity Index",
  description,
  openGraph: {
    title: "Human Stupidity Index",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Stupidity Index",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${anton.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
