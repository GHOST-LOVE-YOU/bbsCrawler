import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@components/footer";
import NavBar from "@components/navbar";
import { Toaster } from "@components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BYR IWhisper",
  description: "BYR IWhisper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <div className="grid-background-md md:hidden"></div>
        <div className="hidden md:block grid-background"></div>
        <div className="flex flex-col min-h-screen relative z-10">
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  );
}
