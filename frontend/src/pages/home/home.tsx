"use client";

import { useReducedMotion, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBagFavoriteFreeIcons,
  Check,
  DeliveryTruck02Icon,
  Clock,
  Store,
  Star,
  Profile,
  ArrowRight,
} from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth";

function StaggerItem({
  i,
  children,
  className,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionReveal({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

const IMG = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const Home = () => {
  const { data } = useSession();
  const user = data?.user;

  const primaryCta = user
    ? user.role === "STORE_ADMIN"
      ? { label: "Go to Dashboard", to: "/store/dashboard" }
      : user.role === "SUPER_ADMIN"
        ? { label: "Go to Admin", to: "/admin/dashboard" }
        : { label: "Browse Stores", to: "#features" }
    : { label: "Start Shopping", to: "/register" };

  const secondaryCta = user
    ? user.role === "CUSTOMER"
      ? { label: "Register Your Store", to: "/register-store" }
      : { label: "How It Works", to: "#how-it-works" }
    : { label: "Explore Features", to: "#how-it-works" };

  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 md:pt-24 overflow-hidden bg-white dark:bg-zinc-950">
        {/* Background layers */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] rounded-full bg-emerald-500/8 dark:bg-emerald-500/5 blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-emerald-500/8 dark:bg-emerald-500/5 blur-3xl" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-400/5 dark:bg-amber-500/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: Content */}
            <div className="max-w-xl">
              <Badge className="mb-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs px-3 py-1 shadow-sm">
                Now in 100+ cities across the country
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-none text-balance font-heading">
                Fresh groceries.
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  At your door in minutes.
                </span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg">
                Skip the checkout line. Get farm-fresh produce, pantry staples,
                and everyday essentials delivered straight to your door in
                under 30 minutes.
              </p>
              <div className="mt-8 flex items-center gap-4">
                {primaryCta.to.startsWith("#") ? (
                  <Button
                    className="h-12 px-7 bg-emerald-600 hover:bg-emerald-700 text-white text-base shadow-lg shadow-emerald-600/25 dark:shadow-emerald-600/15 gap-2"
                    asChild
                  >
                    <a href={primaryCta.to}>
                      {primaryCta.label}
                      <HugeiconsIcon icon={ArrowRight} className="size-4" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    className="h-12 px-7 bg-emerald-600 hover:bg-emerald-700 text-white text-base shadow-lg shadow-emerald-600/25 dark:shadow-emerald-600/15 gap-2"
                    asChild
                  >
                    <Link to={primaryCta.to}>
                      {primaryCta.label}
                      <HugeiconsIcon icon={ArrowRight} className="size-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="h-12 px-7 text-base border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
                  asChild
                >
                  {secondaryCta.to.startsWith("#") ? (
                    <a href={secondaryCta.to}>{secondaryCta.label}</a>
                  ) : (
                    <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
                  )}
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-7 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="size-7 rounded-full border-2 border-white dark:border-zinc-950 overflow-hidden"
                      >
                        <img
                          src={IMG(`customer-${i}`, 28, 28)}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span>
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      10K+
                    </strong>{" "}
                    happy customers
                  </span>
                </div>
                <span className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Check}
                      className="size-3 text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  Fresh guarantee
                </span>
              </div>
            </div>

            {/* Right: Hero Image Showcase */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-[5/6]">
                {/* Main hero image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={IMG("groceries-basket", 600, 720)}
                    alt="Fresh groceries"
                    className="size-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </motion.div>

                {/* Floating card - order */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute -bottom-4 -left-4 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-zinc-200/60 dark:border-zinc-800/60 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-700/30">
                      <HugeiconsIcon
                        icon={DeliveryTruck02Icon}
                        className="size-5 text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Order en route
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Arriving in 12 minutes
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "78%" }}
                      transition={{
                        duration: 1.5,
                        delay: 1,
                        ease: "easeOut",
                      }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Floating card - product */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute -top-3 -right-3 w-44 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-zinc-200/60 dark:border-zinc-800/60 p-3"
                >
                  <div className="size-12 rounded-xl overflow-hidden mb-2">
                    <img
                      src={IMG("fresh-produce", 100, 100)}
                      alt="Fresh produce"
                      className="size-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Organic Veggies
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-emerald-600 font-semibold">
                      $12.99
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <HugeiconsIcon
                          key={si}
                          icon={Star}
                          className="size-3 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating dot accents */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-1/3 -left-3 size-3 rounded-full bg-emerald-400/50"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-1/3 -right-2 size-2 rounded-full bg-amber-400/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── TRUSTED BY ─────────────── */}
      <section className="py-16 md:py-20 border-y border-zinc-100 dark:border-zinc-800/50 relative">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 text-center relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-8">
            Trusted by leading brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {[
              { name: "FreshCo", color: "bg-emerald-100 text-emerald-700" },
              { name: "GreenLeaf", color: "bg-green-100 text-green-700" },
              { name: "QuickMart", color: "bg-blue-100 text-blue-700" },
              { name: "DailyBite", color: "bg-amber-100 text-amber-700" },
              { name: "Farm2Door", color: "bg-orange-100 text-orange-700" },
              { name: "SnapShop", color: "bg-violet-100 text-violet-700" },
            ].map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400"
              >
                <div
                  className={`size-9 rounded-xl ${brand.color} dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center text-sm font-bold shadow-sm`}
                >
                  {brand.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold tracking-tight opacity-60 dark:opacity-50">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <SectionReveal className="py-20 md:py-28 relative" id="how-it-works">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 text-center relative z-10">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-balance font-heading">
            From cart to doorstep in three steps
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            No hassle, no waiting. Just tap, track, and receive.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: ShoppingBagFavoriteFreeIcons,
                title: "Choose your items",
                desc: "Browse thousands of products from your favorite local stores. Fresh produce, pantry staples, and more.",
                tint: "from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-950",
                iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                iconColor: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: Clock,
                title: "We pick & pack",
                desc: "Your personal shopper carefully selects each item, ensuring quality and freshness every time.",
                tint: "from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-950",
                iconBg: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: DeliveryTruck02Icon,
                title: "Delivered in minutes",
                desc: "Real-time tracking from store to your door. Most orders arrive in under 30 minutes.",
                tint: "from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-950",
                iconBg: "bg-amber-100 dark:bg-amber-900/30",
                iconColor: "text-amber-600 dark:text-amber-400",
              },
            ].map((step, i) => (
              <StaggerItem key={step.title} i={i}>
                <div className="relative group">
                  <div
                    className={`rounded-2xl p-8 bg-gradient-to-b ${step.tint} border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div
                          className={`size-16 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-sm`}
                        >
                          <HugeiconsIcon
                            icon={step.icon}
                            className={`size-7 ${step.iconColor}`}
                          />
                        </div>
                        <span className="absolute -top-2 -right-2 size-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold font-heading">
                        {step.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ─────────────── FOR PARTNERS ─────────────── */}
      <SectionReveal
        className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50 relative"
        id="partners"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 -right-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs">
                For Store Partners
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-balance font-heading">
                Grow your business with QuickCart
              </h2>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Join hundreds of stores already reaching more customers through
                our platform. Get real-time orders, analytics, and a dedicated
                partner dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Real-time order management dashboard",
                  "Smart inventory & analytics tools",
                  "Flexible delivery fee & commission model",
                  "Dedicated partner support team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <HugeiconsIcon
                        icon={Check}
                        className="size-3 text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                asChild
              >
                <Link to="/register">Become a Partner</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Active Stores",
                  value: "500+",
                  tint: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                },
                {
                  label: "Avg. Order Value",
                  value: "$28",
                  tint: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30",
                },
                {
                  label: "Monthly Orders",
                  value: "50K+",
                  tint: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30",
                },
                {
                  label: "Avg. Rating",
                  value: "4.8",
                  tint: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl ${stat.tint} p-6 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
              <div className="col-span-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 p-6 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-white dark:bg-emerald-900/40 shadow-sm border border-emerald-200/50 dark:border-emerald-700/30 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Store}
                      className="size-6 text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-heading">
                      Easy onboarding, same-day activation
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Get your store online in hours, not weeks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ─────────────── STATS ─────────────── */}
      <section className="py-20 md:py-24 bg-emerald-600 dark:bg-emerald-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { value: "500+", label: "Store Partners" },
              { value: "50K+", label: "Orders Delivered" },
              { value: "100+", label: "Cities Covered" },
              { value: "1K+", label: "Delivery Drivers" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-white"
              >
                <p className="text-4xl md:text-5xl font-bold tracking-tighter font-heading">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-emerald-100/80 dark:text-emerald-200/80">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── TESTIMONIALS ─────────────── */}
      <SectionReveal className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 text-center">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-balance font-heading">
            Loved by customers and partners
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Here is what people are saying about QuickCart.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I get my weekly groceries delivered in under 20 minutes. The produce is always fresh and the drivers are incredibly friendly.",
                name: "Sarah Chen",
                role: "Customer",
                tint: "bg-white dark:bg-zinc-900/50",
              },
              {
                quote:
                  "Since joining QuickCart, our store revenue has grown by 40%. The partner dashboard makes managing orders effortless.",
                name: "Marcus Johnson",
                role: "Store Owner, GreenLeaf Market",
                tint: "bg-emerald-50/30 dark:bg-emerald-950/15",
              },
              {
                quote:
                  "Flexible hours, great pay, and I get to help my community. Driving for QuickCart has been a game-changer for me.",
                name: "Aisha Patel",
                role: "Delivery Driver",
                tint: "bg-blue-50/30 dark:bg-blue-950/15",
              },
            ].map((t, i) => (
              <StaggerItem key={t.name} i={i}>
                <div
                  className={`rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 text-left ${t.tint} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <HugeiconsIcon
                        key={si}
                        icon={Star}
                        className="size-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {t.role}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* ─────────────── DRIVERS ─────────────── */}
      <SectionReveal className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900/50 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  title: "Flexible Hours",
                  desc: "Deliver on your own schedule.",
                  tint: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                  iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  icon: Profile,
                  title: "Instant Payouts",
                  desc: "Get paid daily. No waiting.",
                  tint:
                    "bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/40 dark:border-emerald-900/30",
                  iconBg: "bg-white dark:bg-emerald-900/30",
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  icon: DeliveryTruck02Icon,
                  title: "Your Vehicle",
                  desc: "Bike, scooter, or car — you choose.",
                  tint:
                    "bg-blue-50/30 dark:bg-blue-950/15 border-blue-200/40 dark:border-blue-900/30",
                  iconBg: "bg-white dark:bg-blue-900/30",
                  iconColor: "text-blue-600 dark:text-blue-400",
                },
                {
                  icon: Star,
                  title: "Top Ratings",
                  desc: "Earn bonuses for great service.",
                  tint:
                    "bg-amber-50/30 dark:bg-amber-950/15 border-amber-200/40 dark:border-amber-900/30",
                  iconBg: "bg-white dark:bg-amber-900/30",
                  iconColor: "text-amber-600 dark:text-amber-400",
                },
              ].map((item, i) => (
                <StaggerItem key={item.title} i={i}>
                  <div
                    className={`rounded-2xl ${item.tint} p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                  >
                    <div
                      className={`size-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-3 shadow-sm`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        className={`size-5 ${item.iconColor}`}
                      />
                    </div>
                    <h3 className="text-sm font-semibold font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs">
                For Drivers
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-balance font-heading">
                Deliver with freedom. Earn on your terms.
              </h2>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Join our fleet of delivery partners. Set your own hours, earn
                competitive pay, and be part of the fastest-growing delivery
                network in your city.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "No minimum hours — deliver when you want",
                  "Weekly bonuses for top-performing drivers",
                  "Real-time route optimization",
                  "24/7 support team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <HugeiconsIcon
                        icon={Check}
                        className="size-3 text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-8 h-11 px-6 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                Start Driving
              </Button>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="py-20 md:py-28 relative">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 dark:from-emerald-800 dark:via-emerald-800 dark:to-emerald-900 p-8 md:p-16 text-center text-white overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-emerald-400/15 blur-2xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter font-heading">
                Ready to change the way you shop?
              </h2>
              <p className="mt-4 text-emerald-100/80 max-w-lg mx-auto text-base">
                Join thousands of happy customers. Download the app or sign up
                to start ordering in minutes.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  className="h-12 px-8 bg-white text-emerald-700 hover:bg-zinc-100 text-base shadow-lg shadow-black/10 gap-2"
                  asChild
                >
                  <Link to="/register">
                    Get Started Free
                    <HugeiconsIcon icon={ArrowRight} className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-8 border-white/30 text-white hover:bg-white/10 text-base"
                >
                  Download the App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── APP DOWNLOAD ─────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 p-8 md:p-12 shadow-sm">
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight font-heading">
                Get the app
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Available on iOS and Android. Order on the go.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="h-12 px-6 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <HugeiconsIcon
                  icon={ShoppingBagFavoriteFreeIcons}
                  className="size-5 mr-2"
                />
                App Store
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <HugeiconsIcon
                  icon={ShoppingBagFavoriteFreeIcons}
                  className="size-5 mr-2"
                />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
