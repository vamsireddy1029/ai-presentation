import NextAuthProvider from "@/provider/NextAuthProvider";
import TanStackQueryProvider from "@/provider/TanstackProvider";
import { ThemeProvider } from "@/provider/theme-provider";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presentation AI",
  description: "AI-powered presentation generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <TanStackQueryProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </TanStackQueryProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
