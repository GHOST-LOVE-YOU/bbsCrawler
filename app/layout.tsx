import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/header/NavBar";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BBS Crawler - Modern Forum Interface",
  description:
    "A modern, responsive forum interface with flat design aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "nvwqp3qoey");
            `,
          }}
        />
      </head>
      <body
        className={`
          ${inter.className}
          flex min-h-screen flex-col
        `}
      >
        <div
          className={`
            grid-background-md
            md:hidden
          `}
        />
        <div
          className={`
            grid-background hidden
            md:block
          `}
        />
        <NavBar />
        <main className="flex-1">
          <div
            className={`
              mx-auto py-2
              md:container md:px-4 md:py-8
            `}
          >
            <div className="mx-auto max-w-6xl">{children}</div>
          </div>
        </main>
        <Toaster />
        <ServiceWorkerRegistration />
        <Footer />
      </body>
    </html>
  );
}
