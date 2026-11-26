import type { ReactNode } from "react";

import { Providers } from "./providers";

interface RootLayoutProps {
  children: ReactNode;
}

// Defines the root layout shared by all application pages.
export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}