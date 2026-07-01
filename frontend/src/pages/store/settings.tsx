import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetStore } from "@/hooks/use-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  Clock,
  Truck,
  MapPin,
  Image as ImageIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useUpdateStoreProfile,
  useUpdateStoreDelivery,
  useUpdateStoreHours,
  useUpdateStoreLogo,
  useUpdateStoreBanner,
} from "@/features/store/hooks/useUpdateStore";

const Settings = () => {
  const { data: store, isLoading } = useGetStore();
  const updateProfile = useUpdateStoreProfile();
  const updateDelivery = useUpdateStoreDelivery();
  const updateHours = useUpdateStoreHours();
  const updateLogo = useUpdateStoreLogo();
  const updateBanner = useUpdateStoreBanner();

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const openingRef = useRef<HTMLInputElement>(null);
  const closingRef = useRef<HTMLInputElement>(null);
  const deliveryFeeRef = useRef<HTMLInputElement>(null);
  const freeDeliveryAboveRef = useRef<HTMLInputElement>(null);
  const minOrderRef = useRef<HTMLInputElement>(null);
  const serviceRadiusRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const dayToAbbr: Record<string, string> = {
    Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU",
    Friday: "FRI", Saturday: "SAT", Sunday: "SUN",
  };

  const [activeDays, setActiveDays] = useState<string[]>([]);

  useEffect(() => {
    if (store) {
      const abbrToDay = Object.fromEntries(
        workingDaysOptions.map((d) => [dayToAbbr[d], d])
      );
      const mapped = store.workingDays.map((d: string) => abbrToDay[d] || d);
      setActiveDays(mapped);
    }
  }, [store]);

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveProfile = async () => {
    if (!store) return;
    updateProfile.mutate({
      storeId: store.id,
      name: nameRef.current?.value,
      description: descriptionRef.current?.value,
      phone: phoneRef.current?.value,
      area: areaRef.current?.value,
      city: cityRef.current?.value,
      addressLine1: addressRef.current?.value,
    });
  };

  const handleSaveHours = async () => {
    if (!store) return;
    const timings = workingDaysOptions.map((day) => ({
      day,
      openTime: openingRef.current?.value || "09:00",
      closeTime: closingRef.current?.value || "21:00",
      isClosed: !activeDays.includes(day),
    }));
    updateHours.mutate({ storeId: store.id, timings });
  };

  const handleSaveDelivery = async () => {
    if (!store) return;
    updateDelivery.mutate({
      storeId: store.id,
      deliveryFee: Number(deliveryFeeRef.current?.value) || 0,
      freeDeliveryAbove: Number(freeDeliveryAboveRef.current?.value) || 0,
      minimumOrderAmount: Number(minOrderRef.current?.value) || 0,
      serviceRadiusKm: Number(serviceRadiusRef.current?.value) || 0,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !store) return;
    updateLogo.mutate({ storeId: store.id, file });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !store) return;
    updateBanner.mutate({ storeId: store.id, file });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex-1 p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Store not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store preferences and configuration
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Store} size={20} />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  ref={nameRef}
                  defaultValue={store.name}
                  placeholder="Enter store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  ref={descriptionRef}
                  defaultValue={store.description || ""}
                  placeholder="Describe your store..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={store.email}
                    placeholder="store@example.com"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    ref={phoneRef}
                    type="tel"
                    defaultValue={store.phone || ""}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Store Owner</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <Avatar>
                    <AvatarImage src={store.owner.image || ""} />
                    <AvatarFallback>
                      {store.owner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{store.owner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {store.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Store Status</p>
                  <p className="text-sm text-muted-foreground">
                    {store.status === "OPEN"
                      ? "Store is currently accepting orders"
                      : "Store is currently closed"}
                  </p>
                </div>
                <Badge
                  variant={store.status === "OPEN" ? "default" : "secondary"}
                >
                  {store.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Verification Status</p>
                  <p className="text-sm text-muted-foreground">
                    {store.isVerified
                      ? "Your store is verified"
                      : "Verification pending"}
                  </p>
                </div>
                <Badge variant={store.isVerified ? "default" : "secondary"}>
                  {store.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>

              <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={MapPin} size={20} />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address Line</Label>
                <Input
                  id="address"
                  ref={addressRef}
                  defaultValue={store.addressLine1}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" ref={areaRef} defaultValue={store.area} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" ref={cityRef} defaultValue={store.city} />
                </div>
                <div className="space-y-2">
                  <Label>Coordinates</Label>
                  <div className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Address"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock} size={20} />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening">Opening Time</Label>
                  <Input
                    id="opening"
                    ref={openingRef}
                    type="time"
                    defaultValue={store.openingTime || "09:00"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closing">Closing Time</Label>
                  <Input
                    id="closing"
                    ref={closingRef}
                    type="time"
                    defaultValue={store.closingTime || "21:00"}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Working Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {workingDaysOptions.map((day) => (
                    <div
                      key={day}
                      className="flex items-center space-x-2 p-3 border rounded-lg"
                    >
                      <Switch
                        id={day}
                        checked={activeDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />
                      <Label htmlFor={day} className="cursor-pointer">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveHours} disabled={updateHours.isPending}>
                {updateHours.isPending ? "Saving..." : "Save Hours"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Truck} size={20} />
                Delivery Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-fee">Delivery Fee (PKR)</Label>
                  <Input
                    id="delivery-fee"
                    ref={deliveryFeeRef}
                    type="number"
                    defaultValue={store.deliveryFee}
                    min="0"
                    step="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-delivery">
                    Free Delivery Above (PKR)
                  </Label>
                  <Input
                    id="free-delivery"
                    ref={freeDeliveryAboveRef}
                    type="number"
                    defaultValue={store.freeDeliveryAbove || 0}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Amount (PKR)</Label>
                  <Input
                    id="min-order"
                    ref={minOrderRef}
                    type="number"
                    defaultValue={store.minimumOrderAmount}
                    min="0"
                    step="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-radius">Service Radius (km)</Label>
                  <Input
                    id="service-radius"
                    ref={serviceRadiusRef}
                    type="number"
                    defaultValue={store.serviceRadiusKm}
                    min="1"
                    max="50"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                <p className="font-medium">Commission Rate</p>
                <p className="text-2xl font-bold">
                  {store.commissionPercent}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Platform commission on each order
                </p>
              </div>

              <Button onClick={handleSaveDelivery} disabled={updateDelivery.isPending}>
                {updateDelivery.isPending ? "Saving..." : "Save Delivery Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={ImageIcon} size={20} />
                Store Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24 rounded-lg">
                    <AvatarImage src={store.logo || ""} />
                    <AvatarFallback className="rounded-lg">
                      {store.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateLogo.isPending}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {updateLogo.isPending ? "Uploading..." : "Upload New Logo"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x200px, PNG or JPG (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Store Banner</Label>
                <div className="space-y-3">
                  {store.banner ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={store.banner}
                        alt="Store banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed flex items-center justify-center">
                      <p className="text-muted-foreground">No banner uploaded</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updateBanner.isPending}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    {updateBanner.isPending ? "Uploading..." : "Upload New Banner"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200x400px, PNG or JPG (max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
