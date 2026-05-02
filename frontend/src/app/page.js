import Header from '@/components/global/header';
import HeroSection from '@/components/homepage/hero'
import Connect from "@/components/homepage/network-join";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";
import { headers } from "next/headers";


export default async function HomePage() {

  let session = null;
  try {
    session = await getSession({
      fetchOptions: { headers: await headers() }
    })
  } catch (error) {
    console.log(error);
    session = null
  }

  const user = session?.data?.user || null;
  return (
    <main className="w-full min-h-screen bg-on-surface">
      <Header user={user} />
      <HeroSection />
      <Separator />
      <Connect user={user} />
    </main>
  )
}
