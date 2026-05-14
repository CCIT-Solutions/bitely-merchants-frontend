"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { FaMoon, FaSatellite } from "react-icons/fa";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Lock,
  ChevronRight,
  X,
  Shield,
  RotateCcw,
  BadgeCheck,
  MapPin,
  Loader2,
} from "lucide-react";
import { CustomField } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";
import { PhoneField } from "@/components/form/PhoneField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/custom/select";
import OrderHeading from "@/components/shared/headings/OrderHeading";
import { useLang } from "@/hooks/useLang";
import Stepper from "@/components/shared/Stepper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/custom/card";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/shared/Logo";
import Image from "next/image";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { FOOD_ITEMS } from "@/data/menu";
import Currency from "@/components/icons/Currency";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMethod = "card" | "apple" | "tamara";
type DeliveryWindow = "early" | "breakfast" | "morning";

interface LatLng {
  lat: number;
  lng: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email").min(5, "Email too short"),
  phone_number: z.number().optional(),
  city: z.string().min(1, "Please select a city"),
  district: z.string().min(2, "Enter your district / neighbourhood"),
  streetAddress: z.string().min(5, "Enter a valid street address"),
  nationalAddress: z.string().optional(),
  apt: z.string().optional(),
  postalCode: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationLabel: z.string().optional(),
});

const CardSchema = z.object({
  cardNumber: z.string().min(19, "Enter a valid card number"),
  cardName: z.string().min(2, "Enter the cardholder name"),
  expiry: z.string().min(7, "Enter a valid expiry"),
  cvv: z.string().min(3, "Enter CVV"),
  zip: z.string().optional(),
});

type ContactFormType = z.infer<typeof ContactSchema>;
type CardFormType = z.infer<typeof CardSchema>;

// ─── Cities ───────────────────────────────────────────────────────────────────
const CITIES = [
  { key: "riyadh", label: { en: "Riyadh", ar: "الرياض" } },
  { key: "dubai", label: { en: "Dubai", ar: "دبي" } },
  { key: "jeddah", label: { en: "Jeddah", ar: "جدة" } },
  { key: "abudhabi", label: { en: "Abu Dhabi", ar: "أبوظبي" } },
] as const;

// City default centers for map initialization
const CITY_CENTERS: Record<string, LatLng> = {
  riyadh: { lat: 24.7136, lng: 46.6753 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  jeddah: { lat: 21.4858, lng: 39.1925 },
  abudhabi: { lat: 24.4539, lng: 54.3773 },
};

// ─── Google Map Picker ────────────────────────────────────────────────────────
const MAP_DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#333333" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#6ef843" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#585858" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#3a3a3a" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "on" }, { color: "#000000" }],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }],
  },
];

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
  overflow: "hidden",
  position: "relative",
};

function GoogleMapPicker({
  value,
  onChange,
  city,
}: {
  value?: LatLng;
  onChange: (latlng: LatLng, label: string) => void;
  city?: string;
}) {
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapMode, setMapMode] = useState<"dark" | "satellite">("dark");
  const [markerPos, setMarkerPos] = useState<LatLng | null>(value ?? null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const defaultCenter: LatLng =
    city && CITY_CENTERS[city]
      ? CITY_CENTERS[city]
      : { lat: 25.2048, lng: 55.2708 };

  const center = markerPos ?? defaultCenter;

  const reverseGeocode = useCallback(
    (latlng: LatLng) => {
      if (!isLoaded) return;
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }
      setIsGeocoding(true);
      geocoderRef.current.geocode({ location: latlng }, (results, status) => {
        setIsGeocoding(false);
        const label =
          status === "OK" && results?.[0]
            ? results[0].formatted_address
            : `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        setAddressLabel(label);
        onChange(latlng, label);
      });
    },
    [isLoaded, onChange],
  );

  // Re-center when city dropdown changes
  useEffect(() => {
    if (!city || !CITY_CENTERS[city]) return;
    const c = CITY_CENTERS[city];
    setMarkerPos(c);
    reverseGeocode(c);
  }, [city, reverseGeocode]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPos(latlng);
      reverseGeocode(latlng);
    },
    [reverseGeocode],
  );

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPos(latlng);
      reverseGeocode(latlng);
    },
    [reverseGeocode],
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
        <MapPin size={11} className="text-primary" />
        Pin your location
        <span className="text-muted-foreground normal-case tracking-normal font-normal ml-1">
          (optional)
        </span>
      </label>

      {/* Collapsed trigger */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 border border-dashed border-border rounded-xl px-4 py-3.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all duration-200 bg-muted/30"
        >
          <MapPin size={15} className="text-primary flex-shrink-0" />
          {markerPos ? (
            <span className="text-foreground truncate text-xs">
              {addressLabel ||
                `${markerPos.lat.toFixed(4)}, ${markerPos.lng.toFixed(4)}`}
            </span>
          ) : (
            <span>Click to open map &amp; drop a pin</span>
          )}
          {markerPos && (
            <span className="ml-auto text-[9px] tracking-widest uppercase text-primary  flex-shrink-0">
              Pinned ✓
            </span>
          )}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {/* Map wrapper — matches LocationMap border + radius */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ height: "260px", border: "1px solid #222" }}
            onWheel={(e) => e.stopPropagation()}
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={center}
                zoom={14}
                onClick={handleMapClick}
                options={{
                  mapTypeId: mapMode === "satellite" ? "hybrid" : "roadmap",
                  styles: mapMode === "dark" ? MAP_DARK_STYLE : undefined,
                  disableDefaultUI: true,
                  gestureHandling: "greedy",
                  keyboardShortcuts: false,
                }}
              >
                {markerPos && (
                  <Marker
                    position={markerPos}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    animation={window.google.maps.Animation.DROP}
                    // icon={
                    //   mapMode === "dark"
                    //     ? {
                    //         url: "/media/icons/map-marker.png",
                    //         scaledSize: new window.google.maps.Size(60, 60),
                    //         origin: new window.google.maps.Point(0, 0),
                    //         anchor: new window.google.maps.Point(30, 30),
                    //       }
                    //     : undefined
                    // }
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 bg-[#212121] flex items-center justify-center gap-2 text-sm text-white/50">
                <Loader2 size={16} className="animate-spin" />
                Loading map…
              </div>
            )}

            {/* Geocoding pill */}
            {isGeocoding && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-white shadow-sm whitespace-nowrap">
                <Loader2 size={11} className="animate-spin" />
                Resolving address…
              </div>
            )}

            {/* Mode toggle — matches LocationMap toggle style */}
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              <button
                type="button"
                onClick={() => setMapMode("dark")}
                title="Dark mode"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md border ${
                  mapMode === "dark"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-black/70 text-white/60 border-white/10 hover:bg-black/90"
                }`}
              >
                <FaMoon size={11} />
              </button>
              <button
                type="button"
                onClick={() => setMapMode("satellite")}
                title="Satellite mode"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md border ${
                  mapMode === "satellite"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-black/70 text-white/60 border-white/10 hover:bg-black/90"
                }`}
              >
                <FaSatellite size={11} />
              </button>
            </div>

            {/* Collapse button */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/10 text-white/80 flex items-center justify-center hover:bg-black/90 transition shadow-sm"
            >
              <X size={12} />
            </button>
          </div>

          {/* Resolved address strip */}
          {addressLabel && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5"
            >
              <MapPin size={12} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground leading-relaxed">
                {addressLabel}
              </p>
            </motion.div>
          )}

          <p className="mt-2 text-[10px] text-muted-foreground tracking-wide">
            Tap the map or drag the pin to adjust your exact drop-off point.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Credit Card Visual ───────────────────────────────────────────────────────
function CreditCardVisual({
  num,
  name,
  exp,
}: {
  num: string;
  name: string;
  exp: string;
}) {
  const display = (num + " •••• •••• •••• ••••").slice(0, 19);
  return (
    <div className="relative rounded-2xl overflow-hidden p-4 sm:p-6 mb-5 aspect-[1.586/1] max-w-sm bg-linear-to-br from-primary-foreground to-primary-foreground/80 text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(300px_150px_at_100%_0%,rgba(110,248,67,0.18),transparent_60%)] pointer-events-none" />
      <div className="relative z-10 flex justify-between items-start mb-2 sm:mb-5">
        <Logo isAlwaysDark className="w-20 h-8" />
        <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
          <circle cx="12" cy="11" r="9" fill="#EB001B" />
          <circle cx="24" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </div>
      <div className="h-6 w-14 relative mb-4">
        <Image
          src="/media/images/checkout/visa-chip.png"
          alt="Card Chip"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative z-10 text-base tracking-widest mb-4 text-white/90">
        {display}
      </div>
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <span className="text-[8px] tracking-widest uppercase text-white/50 block">
            Cardholder
          </span>
          <span className="text-xs tracking-wide text-white/90 uppercase">
            {name || "Your Name"}
          </span>
        </div>
        <div>
          <span className="text-[8px] tracking-widest uppercase text-white/50 block">
            Expires
          </span>
          <span className="text-xs tracking-wide text-white/90">
            {exp || "MM / YY"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Apple Pay Pane ───────────────────────────────────────────────────────────
function ApplePayPane({
  onClose,
  total,
}: {
  onClose: () => void;
  total: string;
}) {
  return (
    <motion.div
      key="apple"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative rounded-2xl overflow-hidden p-6 mb-5 max-w-sm bg-linear-to-br from-primary-foreground to-primary-foreground/80 text-white select-none">
        <div className="absolute inset-0 bg-[radial-gradient(300px_150px_at_100%_0%,rgba(110,248,67,0.18),transparent_60%)] pointer-events-none" />
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold text-base tracking-tight">
            Apple Pay
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
        {[
          ["Pay to", "Bitely Foods Co."],
          ["Card", "•••• 4929 · Visa"],
          ["Contact", "rashed@example.com"],
          ["Shipping", "Riyadh · 11564"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex justify-between py-3 border-b border-white/10 text-sm"
          >
            <span className="text-white/55 text-xs tracking-wider uppercase">
              {l}
            </span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
        Apple Pay uses the card in your default Wallet. We receive only a
        one-time token — your card number stays on your device.
      </p>
    </motion.div>
  );
}

// ─── Tamara Pane ──────────────────────────────────────────────────────────────
function TamaraPane() {
  return (
    <motion.div
      key="tamara"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="border border-border rounded-xl p-5 bg-background">
        <div className="flex justify-between items-start mb-2">
          <Image
            src="/media/images/checkout/tamara.png"
            alt="Tamara"
            height={50}
            width={111}
          />
        </div>

        <div className="rounded-xl bg-muted/40 dark:bg-primary-foreground/20 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
          You will be redirected to Tamara to complete verification. No credit
          card required — just your Saudi mobile number and national ID.
        </div>
      </div>
    </motion.div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
  method,
  onPay,
  loading,
}: {
  method: PaymentMethod;
  onPay: () => void;
  loading: boolean;
}) {
  const [promo, setPromo] = useState("FIRST12");
  const [promoApplied, setPromoApplied] = useState(true);

  return (
    <aside className="rounded-2xl p-6 md:p-8 flex flex-col gap-5 lg:sticky lg:top-6 border dark:bg-primary-foreground/20 lg:max-w-sm">
      <div className="flex justify-between items-start pb-5 border-b border-background/10">
        <div>
          <h4 className="text-xl font-medium tracking-tight">
            Signature <em className="not-italic text-primary">plan</em>
          </h4>
          <p className="text-[10px] tracking-widest uppercase text-primary-forground/50 mt-1">
            21 meals · weekly
          </p>
        </div>
        <button className="text-primary text-xs underline underline-offset-2 hover:no-underline transition">
          Edit
        </button>
      </div>

      <div>
        <p className="text-[9px] tracking-widest uppercase text-primary-forground/40 mb-3">
          Week of Apr 20 — Apr 26
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {FOOD_ITEMS.slice(0, 5).map((meal) => (
            <div
              key={meal.id}
              className="relative w-15 h-17 md:w-10 md:h-12 rounded-lg overflow-hidden flex-shrink-0"
            >
              <Image
                src={meal.image}
                alt={meal.name.en}
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="w-15 h-17 md:w-10 md:h-12 rounded-lg border border-primary-forground/20 flex items-center justify-center text-sm sm:text-[10px] text-primary-forground/60">
            +16
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-sm">
        {[
          {
            l: "Subtotal",
            v: (
              <span className="flex items-center gap-1">
                110.00 <Currency className="size-3.5" />
              </span>
            ),
          },
          { l: "Delivery", v: "Free" },
          {
            l: "Taxes (5%)",
            v: (
              <span className="flex items-center gap-1">
                5.50 <Currency className="size-3.5" />
              </span>
            ),
          },
        ].map(({ l, v }) => (
          <div key={l} className="flex justify-between items-center">
            <span className="text-primary-forground/60">{l}</span>
            <span>{v}</span>
          </div>
        ))}
        {promoApplied && (
          <div className="flex justify-between text-primary">
            <span>
              Promo · <span>FIRST12</span>
            </span>
            <span className="flex items-center gap-1 font-bold">
              17.50 <Currency className="size-4" />
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className="flex-1 border border-primary-forground/15 rounded-xl px-3 py-2.5 text-sm text-primary-forground placeholder:text-primary-forground/30 outline-none focus:border-primary transition"
          placeholder="Promo code"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <button
          onClick={() => setPromoApplied(true)}
          className="dark:text-primary border border-primary/30 px-4 py-2.5 rounded-xl text-sm hover:bg-primary/10 transition"
        >
          Apply
        </button>
      </div>

      <div className="flex justify-between items-end pt-4 border-t border-primary-forground/15">
        <span className="text-[10px] tracking-widest uppercase text-primary-forground/50">
          Total today
        </span>
        <div className="text-right">
          <span className="line-through text-primary-forground/30 text-xs mr-1 flex items-center gap-1">
            115.50 <Currency className="size-3" />
          </span>
          <span className="text-3xl font-medium flex items-center gap-1">
            98.00 <Currency className="size-4" />
            <span className="text-[10px] text-primary-forground/50 ml-1">
              /wk
            </span>
          </span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPay}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70
          ${method === "apple" ? "bg-white text-black hover:bg-gray-100" : "bg-primary text-white hover:brightness-105"}`}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="40"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <Lock size={13} />
        )}
        {loading
          ? "Processing…"
          : method === "apple"
            ? "Pay with Apple Pay"
            : method === "tamara"
              ? "Pay with Tamara"
              : "Confirm & pay 98.00"}
      </motion.button>

      <div className="flex items-center justify-center gap-1.5 text-[9px] tracking-widest uppercase text-primary-forground/40">
        <Shield size={9} />
        256-bit · PCI DSS · 3-D Secure
      </div>

      <div className="flex justify-between text-[9px] tracking-widest uppercase text-primary-forground/40 pt-1 flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <BadgeCheck size={9} /> Cancel anytime
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw size={9} /> Pause any week
        </span>
        <span className="flex items-center gap-1">
          <Check size={9} /> 7-day refund
        </span>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [deliveryWindow, setDeliveryWindow] =
    useState<DeliveryWindow>("breakfast");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, lang, isRTL } = useLang();
  const { isDark } = useThemeStore();
  const router = useRouter();

  // ── Contact & delivery form ──
  const contactForm = useForm<ContactFormType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullName: "RashedAhmed",
      email: "rashed@example.com",
      phone_number: undefined,
      city: "",
      district: "",
      streetAddress: "",
      nationalAddress: "",
      apt: "",
      postalCode: "",
      locationLat: undefined,
      locationLng: undefined,
      locationLabel: "",
    },
  });

  // ── Card payment form ──
  const cardForm = useForm<CardFormType>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      zip: "",
    },
  });

  const watchedCardNum = cardForm.watch("cardNumber");
  const watchedCardName = cardForm.watch("cardName");
  const watchedExpiry = cardForm.watch("expiry");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cardForm.setValue("cardNumber", formatCardNumber(e.target.value));
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cardForm.setValue("expiry", formatExpiry(e.target.value));
  };

  const selectedCity = contactForm.watch("city");
  const watchedLocationLat = contactForm.watch("locationLat");
  const watchedLocationLng = contactForm.watch("locationLng");

  const handleMapChange = useCallback(
    (latlng: LatLng, label: string) => {
      contactForm.setValue("locationLat", latlng.lat);
      contactForm.setValue("locationLng", latlng.lng);
      contactForm.setValue("locationLabel", label);
    },
    [contactForm],
  );

  const pinValue =
    watchedLocationLat !== undefined && watchedLocationLng !== undefined
      ? { lat: watchedLocationLat, lng: watchedLocationLng }
      : undefined;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/confirm");
    }, 1500);
  };

  const deliveryOptions: { id: DeliveryWindow; time: string; label: string }[] =
    [
      { id: "early", time: "6 — 7 AM", label: "Early / pre-gym" },
      { id: "breakfast", time: "7 — 9 AM", label: "With breakfast" },
      { id: "morning", time: "9 — 11 AM", label: "After school run" },
    ];

  const paymentOptions = (
    isdark: boolean,
  ): {
    id: PaymentMethod;
    image: string;
    label: string;
    sub: string;
  }[] => [
    {
      id: "card",
      image: "visa",
      label: "Credit / Debit",
      sub: "Visa · Mastercard · Mada",
    },
    {
      id: "apple",
      image: `apply-pay${isdark ? "-dark" : ""}`,
      label: "Apple Pay",
      sub: "Fastest — Touch ID",
    },
    {
      id: "tamara",
      image: "tamara",
      label: "Tamara",
      sub: "No fees · Tamara",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4 mb-4">
          <OrderHeading
            label={`${t("checkout.title")} `}
            title={t("checkout.heading")}
            subheading={t("checkout.subheading")}
          />
          <Stepper currentIndex={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* 01 · Contact & Delivery ───────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-xl tracking-tight">
                    Contact <em className="italic text-primary">& delivery</em>
                  </CardTitle>
                  <CardDescription>
                    So we know where to leave the chilled box.
                  </CardDescription>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  01
                </span>
              </CardHeader>

              <CardContent>
                <FormProvider {...contactForm}>
                  <div className="space-y-3">
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomField name="fullName" label="Full name">
                        {(field) => (
                          <Input placeholder="RashedAhmed" {...field} />
                        )}
                      </CustomField>

                      <CustomField name="email" label="Email">
                        {(field) => (
                          <Input
                            placeholder="rashed@example.com"
                            type="email"
                            {...field}
                          />
                        )}
                      </CustomField>
                    </div>

                    {/* Row 2: Phone + City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PhoneField
                        label="Phone"
                        name="phone_number"
                        register={contactForm.register}
                        error={contactForm.formState.errors.phone_number}
                      />

                      {/* Row 4: National Address */}
                      <CustomField
                        name="nationalAddress"
                        label={
                          <span className="flex flex-col items-center gap-1">
                            National address
                          </span>
                        }
                      >
                        {(field) => (
                          <Input placeholder="e.g. RHGA 1234" {...field} />
                        )}
                      </CustomField>
                    </div>

                    {/* Row 3: District + Street address */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomField name="district" label="District / Neighbourhood">
                        {(field) => (
                          <Input placeholder="e.g. Al Olaya" {...field} />
                        )}
                      </CustomField>

                      <CustomField name="streetAddress" label="Street address">
                        {(field) => (
                          <Input
                            placeholder="Building, street"
                            {...field}
                          />
                        )}
                      </CustomField>
                    </div> */}

                    {/* Row 5: Apt + Postal code */}

                    {/* Row 6: Google Map Picker */}
                    <GoogleMapPicker
                      value={pinValue}
                      onChange={handleMapChange}
                      city={selectedCity}
                    />
                  </div>
                </FormProvider>
              </CardContent>
            </Card>

            {/* 02 · Delivery Window ──────────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-xl tracking-tight">
                    Delivery <em className="italic text-primary">Window</em>
                  </CardTitle>
                  <CardDescription>
                    Your first box arrives Monday morning, chilled to 4°C.
                  </CardDescription>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  02
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {deliveryOptions.map((o) => (
                    <motion.button
                      key={o.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDeliveryWindow(o.id)}
                      className={`rounded-xl p-4 border text-left flex flex-col gap-1.5 transition-all duration-200 cursor-pointer dark:hover:border-primary/20
                      ${
                        deliveryWindow === o.id
                          ? "bg-background border-foreground dark:border-primary/10"
                          : "bg-background border-border hover:border-foreground/50"
                      }`}
                    >
                      <span className="text-lg font-medium leading-tight">
                        {o.time}
                      </span>
                      <span className="text-[9px] tracking-wider uppercase opacity-60">
                        {o.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 03 · Payment ───────────────────────────────────────────────── */}
            <Card className="rounded-2xl border-border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-xl tracking-tight">
                    Payment
                  </CardTitle>
                  <CardDescription>
                    Encrypted end-to-end. We never see your card number.
                  </CardDescription>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">
                  03
                </span>
              </CardHeader>
              <CardContent>
                {/* Method selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                  {paymentOptions(isDark).map((o) => (
                    <motion.button
                      key={o.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPaymentMethod(o.id)}
                      className={`rounded-xl border p-3.5 text-left flex flex-col gap-2 relative transition-all duration-200 cursor-pointer
                      ${
                        paymentMethod === o.id
                          ? "border-foreground dark:border-primary/10 bg-card dark:bg-primary-foreground shadow-sm"
                          : "border-border bg-background hover:border-foreground/20"
                      }`}
                    >
                      <div
                        className={`absolute top-3 inset-e-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                        ${paymentMethod === o.id ? "border-foreground dark:border-primary/20 bg-foreground dark:bg-primary-foreground" : "border-border"}`}
                      >
                        {paymentMethod === o.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>

                      <div className="h-6 w-18 relative">
                        <Image
                          src={`/media/images/checkout/${o.image}.png`}
                          alt={o.label}
                          fill
                          className={cn(
                            "object-contain",
                            isRTL ? "object-right" : "object-left",
                          )}
                        />
                      </div>

                      <span className="text-xs font-semibold text-foreground pr-4">
                        {o.label}
                      </span>
                      <span className="text-[9px] tracking-wider uppercase text-muted-foreground">
                        {o.sub}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Payment panes */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && (
                    <FormProvider {...cardForm}>
                      <motion.div
                        key="card-wrapper"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CreditCardVisual
                          num={watchedCardNum}
                          name={watchedCardName}
                          exp={watchedExpiry}
                        />
                        <div className="grid grid-cols-1 gap-3">
                          <CustomField name="cardNumber" label="Card number">
                            {(field) => (
                              <Input
                                {...field}
                                placeholder="4242 4242 4242 4242"
                                maxLength={19}
                                inputMode="numeric"
                                onChange={handleCardNumberChange}
                              />
                            )}
                          </CustomField>

                          <CustomField name="cardName" label="Cardholder name">
                            {(field) => (
                              <Input
                                {...field}
                                placeholder="As printed on card"
                              />
                            )}
                          </CustomField>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <CustomField name="expiry" label="Expiry">
                              {(field) => (
                                <Input
                                  {...field}
                                  placeholder="MM / YY"
                                  maxLength={7}
                                  onChange={handleExpiryChange}
                                />
                              )}
                            </CustomField>

                            <CustomField name="cvv" label="CVV">
                              {(field) => (
                                <Input
                                  {...field}
                                  placeholder="•••"
                                  maxLength={4}
                                  inputMode="numeric"
                                />
                              )}
                            </CustomField>

                            <CustomField name="zip" label="ZIP">
                              {(field) => (
                                <Input {...field} placeholder="11564" />
                              )}
                            </CustomField>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox />
                            <span className="text-base">
                              Save card for next week
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    </FormProvider>
                  )}

                  {paymentMethod === "apple" && (
                    <ApplePayPane
                      onClose={() => setPaymentMethod("card")}
                      total="98.00"
                    />
                  )}

                  {paymentMethod === "tamara" && <TamaraPane />}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ──────────────────────────────── */}
          <OrderSummary
            method={paymentMethod}
            onPay={handlePay}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
