import type { ReactNode } from "react";
import { GoogleTagManager } from "@/shared/components/GoogleTagManager";
import "@yaireo/tagify/dist/tagify.css";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <GoogleTagManager containerId={process.env.NEXT_PUBLIC_GTM_ID} />
        {children}
      </body>
    </html>
  );
}
