import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Choir - Brand Voice Onboarding</title>
          <meta name="description" content="Create your unique brand voice with Choir" />
        </head>
        <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-screen flex-col">
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 