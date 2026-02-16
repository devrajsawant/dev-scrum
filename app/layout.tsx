import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/themeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dev Scrum",
  description: "Project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <body className="dotted-background px-10">
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            <Footer />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

export const dynamic = "force-dynamic";
