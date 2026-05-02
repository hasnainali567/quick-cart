import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/global/header";


const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

export default async function RootLayout({ children }) {
  let session = null;

  try {
    session = await getSession({
      fetchOptions: { headers: await headers() }
    })
  } catch (error) {
    console.log(error);
    session = null
  }

  const user = session ? session?.data?.user : null;

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${figtree.variable} ${figtree.className} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full h-screen w-full">
          {children}</body>
    </html>
  );
}
