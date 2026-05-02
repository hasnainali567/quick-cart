import { Separator } from '../ui/separator'
import Header from './header'
import HeroSection from './hero'
import Connect from './network-join'

export default function HomePage() {
    return (
        <main className="w-full min-h-screen bg-on-surface">
            <Header />
            <HeroSection />
            <Separator />
            <Connect />
        </main>
    )
}
