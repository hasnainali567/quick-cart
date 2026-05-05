import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin']
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${figtree.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
