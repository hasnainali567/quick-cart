import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth";
import { registerStore } from "@/features/store/api/mutations";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  MapPinIcon,
  Building03Icon,
  GlobeIcon,
  RouteIcon,
} from "@hugeicons/core-free-icons";

const RegisterStore = () => {
  const navigate = useNavigate();
  const { data: session, refetch } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    area: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.addressLine1 || !form.area || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await registerStore({
        name: form.name,
        addressLine1: form.addressLine1,
        area: form.area,
        city: form.city,
        latitude: Number(form.latitude) || 0,
        longitude: Number(form.longitude) || 0,
      });
      toast.success("Store created successfully! Redirecting...");
      await refetch();
      navigate("/store/dashboard");
    } catch {
      toast.error("Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — brand side */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="flex size-24 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-8 ring-1 ring-white/20">
            <HugeiconsIcon
              icon={Store01Icon}
              size={48}
              className="text-white"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Start Selling Today
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Join thousands of merchants on QuickCart. Set up your store, list
            your products, and start reaching customers in your area.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 w-full">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-xs text-white/60 mt-1">Active Stores</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-xs text-white/60 mt-1">Daily Orders</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100K+</p>
              <p className="text-xs text-white/60 mt-1">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form side */}
      <div className="flex w-full lg:w-[55%] items-center justify-center p-6 md:p-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100">
              <HugeiconsIcon icon={Store01Icon} size={24} className="text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Register Your Store
              </h1>
              <p className="text-sm text-gray-500">Start selling on QuickCart</p>
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Register Your Store
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in the details below to get started.{" "}
              {session?.user?.email && (
                <>
                  You&apos;re signed in as{" "}
                  <span className="font-medium text-gray-700">
                    {session.user.email}
                  </span>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Store Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Store01Icon}
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Fresh Mart"
                    required
                    className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={MapPinIcon}
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. 123 Main Street"
                    required
                    className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                    Area <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Building03Icon}
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="area"
                      value={form.area}
                      onChange={handleChange}
                      placeholder="e.g. Gulberg"
                      required
                      className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={GlobeIcon}
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Lahore"
                      required
                      className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">
                  Store Location <span className="text-gray-300 font-normal">(optional)</span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                      Latitude
                    </Label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={RouteIcon}
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        id="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="e.g. 31.5204"
                        type="number"
                        step="any"
                        className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                      Longitude
                    </Label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={RouteIcon}
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        id="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="e.g. 74.3587"
                        type="number"
                        step="any"
                        className="h-12 pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating Store...
                </span>
              ) : (
                "Register Store"
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">
              By registering, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStore;
