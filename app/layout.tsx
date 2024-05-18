import type { Metadata } from "next";
import AuthProvider from "./auth/Provider";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Pipeline Conversion Kit",
  description: "",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mui-color-scheme="light" suppressHydrationWarning={true}>
      <body>
        <AuthProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
