import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/themeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import "./globals.css";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className="dotted-background">
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
