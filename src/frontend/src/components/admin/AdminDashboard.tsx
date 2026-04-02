import {
  BarChart2,
  Check,
  DollarSign,
  Download,
  FileText,
  Globe,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  Palette,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LANGUAGES } from "../../i18n/languages";
import { useLanguageStore } from "../../useLanguageStore";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "../../useShortcutsStore";
import type { SearchEngine } from "../../useShortcutsStore";
import {
  getCountsForRange,
  getRecordsInRange,
  getTodayTotal,
} from "../../utils/searchStats";
import { AdminLogin } from "./AdminLogin";
import { AnalyticsSection } from "./AnalyticsSection";
import { DomainPartnersSection } from "./DomainPartnersSection";
import { GlobalControlsSection } from "./GlobalControlsSection";
import { ImageCropperModal } from "./ImageCropperModal";
import { LegalCmsSection } from "./LegalCmsSection";
import { SecurityStatusPanel } from "./SecurityStatusPanel";
import { ShortcutsManager } from "./ShortcutsManager";
import { UserDatabaseSection } from "./UserDatabaseSection";

type Section =
  | "analytics"
  | "shortcuts"
  | "appearance"
  | "settings"
  | "languages"
  | "users"
  | "wallet"
  | "globalControls"
  | "security"
  | "legalCms"
  | "monetization";

const navItems: {
  id: Section;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  {
    id: "shortcuts",
    label: "Shortcuts Manager",
    icon: <LayoutGrid size={18} />,
  },
  { id: "users", label: "User Database", icon: <Users size={18} /> },
  { id: "languages", label: "Languages", icon: <Globe size={18} /> },
  { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  { id: "wallet", label: "Safe-Guard Wallet", icon: <Shield size={18} /> },
  {
    id: "globalControls",
    label: "Global Controls",
    icon: <MapPin size={18} />,
  },
  {
    id: "security",
    label: "Security",
    icon: <ShieldCheck size={18} />,
  },
  {
    id: "legalCms",
    label: "Browser Legal Manager",
    icon: <FileText size={18} />,
  },
  {
    id: "monetization",
    label: "Monetization & API",
    icon: <DollarSign size={18} />,
  },
];

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex-shrink-0"
      aria-checked={value}
      role="switch"
    >
      <div
        className="w-10 h-5 rounded-full relative transition-all duration-200"
        style={{ background: value ? "#1A73E8" : "#e5e7eb" }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: value ? "translateX(21px)" : "translateX(2px)" }}
        />
      </div>
    </button>
  );
}

function AppearanceSection() {
  const {
    splashLogoUrl,
    splashBgColor,
    splashAnimation,
    setSplashConfig,
    homeLogoUrl,
    headerBrandText,
    setHomeAppearance,
  } = useShortcutsStore();
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<"splash" | "home">("splash");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const homeLogoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (file: File, target: "splash" | "home") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setCropTarget(target);
      setCropSrc(src);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Appearance</h2>
        <p className="text-sm text-gray-500">
          Manage brand colors, splash screen, and visual identity.
        </p>
      </div>

      {/* Home Page Logo card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Home Page Logo
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Upload a custom logo for the browser home page header.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Logo Image</span>
          <div className="flex items-center gap-3">
            {homeLogoUrl ? (
              <img
                src={homeLogoUrl}
                alt="Home logo"
                className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">A</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={homeLogoInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoFileChange(file, "home");
                e.target.value = "";
              }}
            />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                data-ocid="appearance.home_logo.upload_button"
                onClick={() => homeLogoInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Upload Logo
              </button>
              {homeLogoUrl && (
                <button
                  type="button"
                  data-ocid="appearance.home_logo.delete_button"
                  onClick={() => setHomeAppearance({ homeLogoUrl: "" })}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header Brand Text card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Header Brand Text
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Change the brand name shown in the browser home page header.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            data-ocid="appearance.brand_text.input"
            value={headerBrandText}
            onChange={(e) =>
              setHomeAppearance({
                headerBrandText: e.target.value.slice(0, 20),
              })
            }
            placeholder="Aflino"
            maxLength={20}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-400 bg-gray-50"
          />
          <p className="text-xs text-gray-400">
            {headerBrandText.length}/20 characters — shown next to the logo on
            the home page.
          </p>
        </div>
      </div>

      {/* Brand Color card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Brand Color
        </h3>
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-xl flex-shrink-0"
            style={{ background: "#1A73E8" }}
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-gray-800">Aflino Blue</span>
            <span className="text-sm text-gray-500">#1A73E8</span>
            <span className="text-xs text-gray-400 mt-1">
              Brand color is fixed to Aflino Blue and cannot be changed.
            </span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Primary Color</span> —
            Used for buttons, toggles, and active states.
          </p>
        </div>
      </div>

      {/* Splash Screen Manager card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Splash Screen Manager
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Customize the splash screen shown when the browser launches.
        </p>

        <div className="flex flex-col divide-y divide-gray-50">
          {/* Logo Upload row */}
          <div className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-gray-700">
              Splash Logo
            </span>
            <div className="flex items-center gap-3">
              {splashLogoUrl ? (
                <img
                  src={splashLogoUrl}
                  alt="Splash logo"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">A</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoFileChange(file, "splash");
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                data-ocid="splash.logo.upload_button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Upload Logo
              </button>
            </div>
          </div>

          {/* Background Color row */}
          <div className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-gray-700">
              Splash Background
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                data-ocid="splash.bg_color.input"
                value={splashBgColor}
                onChange={(e) =>
                  setSplashConfig({ splashBgColor: e.target.value })
                }
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-transparent"
                style={{ padding: 2 }}
              />
              <input
                type="text"
                data-ocid="splash.bg_hex.input"
                value={splashBgColor}
                onChange={(e) =>
                  setSplashConfig({ splashBgColor: e.target.value })
                }
                maxLength={7}
                className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Animation Style row */}
          <div className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-gray-700">
              Animation Style
            </span>
            <select
              data-ocid="splash.animation.select"
              value={splashAnimation}
              onChange={(e) =>
                setSplashConfig({
                  splashAnimation: e.target.value as "fade" | "scale" | "slide",
                })
              }
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-400 bg-white cursor-pointer"
            >
              <option value="scale">Scale (Default)</option>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>
        </div>

        {/* Preview hint */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Changes apply on the next app launch. The splash screen displays for
            3 seconds before revealing the browser.
          </p>
        </div>
      </div>

      {/* Crop Modal */}
      {cropSrc && (
        <ImageCropperModal
          open={true}
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onCropComplete={(dataUrl) => {
            if (cropTarget === "home") {
              setHomeAppearance({ homeLogoUrl: dataUrl });
            } else {
              setSplashConfig({ splashLogoUrl: dataUrl });
            }
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}

const searchEngines: { id: SearchEngine; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "bing", label: "Bing" },
  { id: "duckduckgo", label: "DuckDuckGo" },
  { id: "yahoo", label: "Yahoo" },
  { id: "custom", label: "Custom Engine" },
];

const browserSettingsDefaults = [
  {
    id: "javascript",
    label: "JavaScript",
    description: "Enable JavaScript on all pages",
  },
  {
    id: "popup_blocker",
    label: "Pop-up Blocker",
    description: "Block pop-up windows",
  },
  {
    id: "safe_browsing",
    label: "Safe Browsing",
    description: "Warn about dangerous sites",
  },
  {
    id: "autofill",
    label: "Auto-fill",
    description: "Automatically fill forms",
  },
];

function SettingsSection() {
  const {
    voiceCameraEnabled,
    setVoiceCameraEnabled,
    searchEngine,
    setSearchEngine,
    jsEnabled,
    setJsEnabled,
    googleSearchApiKey,
    searchEngineCx,
    googlePartnerTrackingId,
    bingSearchApiKey,
    bingPartnershipCampaignId,
    duckduckgoAffiliateToken,
    customEngineUrlPattern,
    customAffiliateId,
    inAppSearchEnabled,
    setMultiEngineConfig,
    enableUserProfiles,
    setEnableUserProfiles,
  } = useShortcutsStore();
  const [activeEngineTab, setActiveEngineTab] = useState<
    "google" | "bing" | "duckduckgo" | "custom"
  >("google");
  const [browserSettings, setBrowserSettings] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      browserSettingsDefaults
        .filter((s) => s.id !== "javascript")
        .map((s) => [s.id, true]),
    ),
  );

  const handleBrowserToggle = (id: string) => {
    if (id === "javascript") {
      const next = !jsEnabled;
      setJsEnabled(next);
      if (!next) {
        toast.info("JavaScript is disabled. Pages may not load correctly.", {
          duration: 4000,
        });
      } else {
        toast.success("JavaScript is enabled.");
      }
    } else {
      setBrowserSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Settings</h2>
        <p className="text-sm text-gray-500">
          Configure browser behavior and defaults.
        </p>
      </div>

      {/* Search Features card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Search Features
        </h3>
        <div className="flex flex-col divide-y divide-gray-50">
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-700">
                Voice & Camera Search
              </span>
              <span className="text-xs text-gray-400">
                Enable microphone and camera icons in the search bar
              </span>
            </div>
            <Toggle
              value={voiceCameraEnabled}
              onChange={() => setVoiceCameraEnabled(!voiceCameraEnabled)}
            />
          </div>
        </div>
      </div>

      {/* User Profiles card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          User Profiles
        </h3>
        <div className="flex flex-col divide-y divide-gray-50">
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-700">
                Enable User Profiles
              </span>
              <span className="text-xs text-gray-400">
                Allow users to access their profile page from the browser.
              </span>
            </div>
            <Toggle
              value={enableUserProfiles}
              onChange={() => setEnableUserProfiles(!enableUserProfiles)}
            />
          </div>
        </div>
      </div>

      {/* Multi-Engine API Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            Multi-Engine API Configuration
          </h3>
          <p className="text-xs text-gray-400">
            Configure API keys and affiliate IDs for each search engine. The
            active engine is controlled by the &ldquo;Search Engine&rdquo;
            selector below.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {(["google", "bing", "duckduckgo", "custom"] as const).map((tab) => {
            const labels: Record<string, string> = {
              google: "Google",
              bing: "Bing",
              duckduckgo: "DuckDuckGo",
              custom: "Custom",
            };
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveEngineTab(tab)}
                className={[
                  "flex-1 min-w-fit px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                  activeEngineTab === tab
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                ].join(" ")}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab: Google */}
        {activeEngineTab === "google" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Google Search
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-google-api-key"
                className="text-sm font-medium text-gray-700"
              >
                Google Custom Search API Key
              </label>
              <input
                type="password"
                placeholder="Stored securely — enter new key to update"
                value=""
                id="me-google-api-key"
                onChange={(e) =>
                  setMultiEngineConfig({ googleSearchApiKey: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
              {googleSearchApiKey && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  🔒 Keys are obfuscated in storage. Last 4:{" "}
                  <code className="font-mono font-bold text-gray-600">
                    {googleSearchApiKey.slice(-4)}
                  </code>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-google-cx"
                className="text-sm font-medium text-gray-700"
              >
                Search Engine ID (CX)
              </label>
              <input
                type="text"
                placeholder="Enter your CX ID..."
                value={searchEngineCx}
                id="me-google-cx"
                onChange={(e) =>
                  setMultiEngineConfig({ searchEngineCx: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-google-tracking"
                className="text-sm font-medium text-gray-700"
              >
                Google Partner Tracking ID
              </label>
              <input
                type="text"
                placeholder="Your Google affiliate / revenue-share tracking ID..."
                value={googlePartnerTrackingId}
                id="me-google-tracking"
                onChange={(e) =>
                  setMultiEngineConfig({
                    googlePartnerTrackingId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
          </div>
        )}

        {/* Tab: Bing */}
        {activeEngineTab === "bing" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                Bing (Microsoft Advertising)
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-bing-key"
                className="text-sm font-medium text-gray-700"
              >
                Bing Search API Key
              </label>
              <input
                type="text"
                placeholder="Enter your Bing API key here..."
                value={bingSearchApiKey}
                id="me-bing-key"
                onChange={(e) =>
                  setMultiEngineConfig({ bingSearchApiKey: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-bing-campaign"
                className="text-sm font-medium text-gray-700"
              >
                Bing Partnership / Campaign ID
              </label>
              <input
                type="text"
                placeholder="Enter your Bing partnership or campaign ID..."
                value={bingPartnershipCampaignId}
                id="me-bing-campaign"
                onChange={(e) =>
                  setMultiEngineConfig({
                    bingPartnershipCampaignId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
          </div>
        )}

        {/* Tab: DuckDuckGo */}
        {activeEngineTab === "duckduckgo" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                DuckDuckGo (API Partners)
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-ddg-token"
                className="text-sm font-medium text-gray-700"
              >
                DuckDuckGo Affiliate ID / Token
              </label>
              <input
                type="text"
                placeholder="Enter your DuckDuckGo affiliate ID or partner token..."
                value={duckduckgoAffiliateToken}
                id="me-ddg-token"
                onChange={(e) =>
                  setMultiEngineConfig({
                    duckduckgoAffiliateToken: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-400 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
              DuckDuckGo partner integrations are available via the DuckDuckGo
              API Partners program. The affiliate token is appended as{" "}
              <code className="font-mono bg-orange-100 px-1 rounded">?t=</code>{" "}
              on every search.
            </p>
          </div>
        )}

        {/* Tab: Custom Engine */}
        {activeEngineTab === "custom" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Custom Engine (Fallback)
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-custom-url"
                className="text-sm font-medium text-gray-700"
              >
                Custom Engine Search URL Pattern
              </label>
              <input
                type="text"
                placeholder="https://yoursite.com/search?q={query}"
                value={customEngineUrlPattern}
                id="me-custom-url"
                onChange={(e) =>
                  setMultiEngineConfig({
                    customEngineUrlPattern: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50 font-mono"
              />
              <span className="text-xs text-gray-400">
                Use{" "}
                <code className="font-mono bg-gray-100 px-1 rounded">
                  {"{query}"}
                </code>{" "}
                as the placeholder for the search term.
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="me-custom-affiliate"
                className="text-sm font-medium text-gray-700"
              >
                Custom Affiliate ID
              </label>
              <input
                type="text"
                placeholder="Enter your custom affiliate ID..."
                value={customAffiliateId}
                id="me-custom-affiliate"
                onChange={(e) =>
                  setMultiEngineConfig({ customAffiliateId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              />
            </div>
          </div>
        )}

        {/* Global: Enable In-App Search */}
        <div className="border-t border-gray-100 pt-4 mt-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 flex-1 mr-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700">
                  Enable In-App Search Results
                </span>
                <span
                  title="If ON, results stay inside Aflino (Google only). If OFF, users are redirected to the selected search engine."
                  className="cursor-help text-gray-400 text-xs border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none"
                >
                  ?
                </span>
              </div>
              <span className="text-xs text-gray-400">
                Applies to the active engine. In-app rendering currently
                supported for Google Custom Search.
              </span>
            </div>
            <Toggle
              value={inAppSearchEnabled}
              onChange={() =>
                setMultiEngineConfig({
                  inAppSearchEnabled: !inAppSearchEnabled,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Search Engine
        </h3>
        <div className="flex flex-col gap-2">
          {searchEngines.map((engine) => (
            <button
              key={engine.id}
              type="button"
              data-ocid={`settings.search_engine.${engine.id}.radio`}
              onClick={() => {
                setSearchEngine(engine.id);
                toast.success(`Search engine set to ${engine.label}.`);
              }}
              className={[
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                searchEngine === engine.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
              ].join(" ")}
            >
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor:
                    searchEngine === engine.id ? "#1A73E8" : "#d1d5db",
                }}
              >
                {searchEngine === engine.id && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#1A73E8" }}
                  />
                )}
              </div>
              {engine.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Browser Settings
        </h3>
        <div className="flex flex-col divide-y divide-gray-50">
          {browserSettingsDefaults.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-700">
                  {setting.label}
                </span>
                <span className="text-xs text-gray-400">
                  {setting.description}
                </span>
              </div>
              <Toggle
                value={
                  setting.id === "javascript"
                    ? jsEnabled
                    : (browserSettings[setting.id] ?? true)
                }
                onChange={() => handleBrowserToggle(setting.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LanguageManagerSection() {
  const { landmarkIcons, setLandmarkIcon } = useLanguageStore();
  const [cropState, setCropState] = useState<{
    code: string;
    src: string;
  } | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (code: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setCropState({ code, src });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Language Icons</h2>
        <p className="text-sm text-gray-500">
          Upload landmark icons for each language displayed in the browser
          header. Images will be cropped to square or circle shape.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LANGUAGES.map((lang, i) => {
          const icon = landmarkIcons[lang.code];
          return (
            <div
              key={lang.code}
              data-ocid={`languages.item.${i + 1}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
            >
              {/* Icon preview */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                {icon ? (
                  <img
                    src={icon}
                    alt={lang.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl leading-none">{lang.emoji}</span>
                )}
                {icon && (
                  <div
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#1A73E8" }}
                    title="Custom icon uploaded"
                  >
                    <Check size={8} stroke="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Language info */}
              <div className="text-center w-full">
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {lang.nativeName}
                  </span>
                  {lang.isRTL && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                      RTL
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 block">{lang.name}</span>
                <span className="text-[10px] text-gray-300">{lang.region}</span>
              </div>

              {/* Upload button */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => {
                  fileRefs.current[lang.code] = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(lang.code, file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                data-ocid={`languages.upload_button.${i + 1}`}
                onClick={() => fileRefs.current[lang.code]?.click()}
                className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  borderColor: icon ? "#d1d5db" : "#1A73E8",
                  color: icon ? "#6b7280" : "#1A73E8",
                  background: icon ? "#f9fafb" : "#eff6ff",
                }}
              >
                {icon ? "Replace Icon" : "Upload Icon"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Crop Modal */}
      {cropState && (
        <ImageCropperModal
          open={true}
          imageSrc={cropState.src}
          onClose={() => setCropState(null)}
          onCropComplete={(dataUrl) => {
            setLandmarkIcon(cropState.code, dataUrl);
            setCropState(null);
          }}
        />
      )}
    </div>
  );
}

function SparklineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 300;
  const height = 48;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ")} ${width},${height}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-12"
      preserveAspectRatio="none"
      aria-label="Search volume sparkline chart"
      role="img"
    >
      <title>Search volume over last 24 hours</title>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A73E8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1A73E8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="#1A73E8"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MonetizationApiSection() {
  const {
    googleSearchApiKey,
    searchEngineCx,
    googlePartnerTrackingId,
    inAppSearchEnabled,
    setMultiEngineConfig,
  } = useShortcutsStore();

  const maskApiKey = (key: string) =>
    key ? `${"•".repeat(Math.max(0, key.length - 4))}${key.slice(-4)}` : "";

  const [todayTotal, setTodayTotal] = useState<number>(() => getTodayTotal());
  const [rpm, setRpm] = useState<number>(() => {
    const saved = localStorage.getItem("aflino_rpm");
    return saved ? Number.parseFloat(saved) : 2.5;
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [selectedPreset, setSelectedPreset] = useState<
    "today" | "7d" | "month" | "custom"
  >("today");
  const [sparklineData, setSparklineData] = useState<number[]>(() =>
    getCountsForRange(today, today),
  );

  const handlePreset = (preset: "today" | "7d" | "month") => {
    const t = new Date();
    const todayStr = t.toISOString().split("T")[0];
    let start = todayStr;
    if (preset === "7d") {
      const d = new Date(t);
      d.setDate(d.getDate() - 6);
      start = d.toISOString().split("T")[0];
    } else if (preset === "month") {
      start = `${todayStr.slice(0, 7)}-01`;
    }
    setStartDate(start);
    setEndDate(todayStr);
    setSelectedPreset(preset);
    setSparklineData(getCountsForRange(start, todayStr));
  };

  const exportSearchCSV = () => {
    const partnerId = localStorage.getItem("aflino_partner_id") || "";
    const partnerStatus = partnerId ? "Active" : "Not Set";
    const records = getRecordsInRange(startDate, endDate);
    const rows = ["Date,Hour,Timestamp,Search Count,Partner ID Status"];
    for (const record of records) {
      record.counts.forEach((count: number, hour: number) => {
        const ts = `${record.date} ${String(hour).padStart(2, "0")}:00`;
        rows.push(`${record.date},${hour},${ts},${count},${partnerStatus}`);
      });
    }
    if (rows.length === 1) {
      toast.info("No data found for the selected date range.");
      return;
    }
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aflino_Report_${startDate}_to_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  const resetTodayCount = () => {
    const todayDate = new Date().toISOString().split("T")[0];
    const fresh = {
      date: todayDate,
      counts: new Array(24).fill(0),
      lastUpdated: Date.now(),
    };
    localStorage.setItem("aflino_search_stats", JSON.stringify(fresh));
    setTodayTotal(0);
    setSparklineData(getCountsForRange(startDate, endDate));
    setShowResetConfirm(false);
    toast.success("Search count reset.");
  };

  useEffect(() => {
    const refresh = () => {
      setTodayTotal(getTodayTotal());
      setSparklineData(getCountsForRange(startDate, endDate));
    };
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Monetization & API
        </h2>
        <p className="text-sm text-gray-500">
          Configure Google Custom Search API for in-app results and revenue
          tracking.
        </p>
      </div>

      {/* Partner Tracking Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <DollarSign size={20} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-0.5">
            Revenue Sharing
          </p>
          <p className="text-xs text-blue-600 leading-relaxed">
            The Partner Tracking ID is automatically appended to all search
            redirect URLs (as{" "}
            <code className="bg-blue-100 px-1 rounded font-mono">
              ?ref=YOUR_ID
            </code>
            ), telling search engines that traffic comes from Aflino Browser.
          </p>
        </div>
      </div>

      {/* API Configuration Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-800">
          Google Custom Search API
        </h3>

        {/* API Key */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mon-api-key"
            className="text-sm font-medium text-gray-700"
          >
            Google Custom Search API Key
          </label>
          <input
            id="mon-api-key"
            data-ocid="monetization.api_key.input"
            type="password"
            placeholder="Enter API key — stored securely, never displayed"
            defaultValue=""
            onChange={(e) =>
              setMultiEngineConfig({ googleSearchApiKey: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
          />
          {googleSearchApiKey && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              🔒 Key saved. Showing last 4 chars:{" "}
              <code className="font-mono font-bold text-gray-600">
                {maskApiKey(googleSearchApiKey)}
              </code>
            </p>
          )}
        </div>

        {/* CX */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mon-cx" className="text-sm font-medium text-gray-700">
            Search Engine ID (CX)
          </label>
          <input
            id="mon-cx"
            data-ocid="monetization.cx.input"
            type="text"
            placeholder="e.g. 017576662512468239146:omuauf_lfve"
            value={searchEngineCx}
            onChange={(e) =>
              setMultiEngineConfig({ searchEngineCx: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
          />
          <p className="text-xs text-gray-400">
            Get this from{" "}
            <span className="font-medium text-gray-500">
              programmablesearchengine.google.com
            </span>
          </p>
        </div>

        {/* Partner Tracking ID */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mon-tracking"
            className="text-sm font-medium text-gray-700"
          >
            Partner Tracking ID
          </label>
          <input
            id="mon-tracking"
            data-ocid="monetization.tracking_id.input"
            type="text"
            placeholder="e.g. aflino-browser-partner-001"
            value={googlePartnerTrackingId}
            onChange={(e) =>
              setMultiEngineConfig({ googlePartnerTrackingId: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
          />
          <p className="text-xs text-gray-400">
            Appended to all search redirect URLs for revenue-share attribution.
          </p>
        </div>
      </div>

      {/* In-App Results Toggle Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                Show Results Inside Browser
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Pro
              </span>
            </div>
            <span className="text-xs text-gray-400 leading-relaxed max-w-xs">
              When ON and API keys are set, search results appear natively
              inside Aflino instead of redirecting to Google. Falls back to
              redirect if API key is missing.
            </span>
          </div>
          <Toggle
            value={inAppSearchEnabled}
            onChange={() =>
              setMultiEngineConfig({ inAppSearchEnabled: !inAppSearchEnabled })
            }
          />
        </div>

        {/* Status indicator */}
        <div
          className={[
            "mt-4 px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2",
            googleSearchApiKey && searchEngineCx
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
          data-ocid="monetization.api_status.panel"
        >
          <div
            className={[
              "w-2 h-2 rounded-full shrink-0",
              googleSearchApiKey && searchEngineCx
                ? "bg-green-500"
                : "bg-amber-400",
            ].join(" ")}
          />
          {googleSearchApiKey && searchEngineCx
            ? "API keys configured — in-app results are ready."
            : "API Key and CX are required to activate in-app results."}
        </div>
      </div>

      {/* Live Revenue Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Header row: title | preset pills | live badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-gray-800 flex-1 min-w-0">
            Revenue & Search Analytics
          </h3>

          {/* Quick-select preset pills */}
          <div
            className="flex items-center gap-1"
            data-ocid="monetization.revenue.tab"
          >
            {(["today", "7d", "month"] as const).map((preset) => {
              const labels: Record<string, string> = {
                today: "Today",
                "7d": "Last 7d",
                month: "This Month",
              };
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={[
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                    selectedPreset === preset
                      ? "bg-[#1A73E8] text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  {labels[preset]}
                </button>
              );
            })}
          </div>

          {/* Live pulse badge */}
          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
        </div>

        {/* Controls row: date inputs + Export + Reset — always visible */}
        <div
          className="flex flex-wrap items-end gap-2"
          data-ocid="monetization.revenue.date_range_picker"
        >
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="range-start"
              className="text-[10px] font-medium text-gray-500 uppercase tracking-wide"
            >
              From
            </label>
            <input
              id="range-start"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedPreset("custom");
                setSparklineData(getCountsForRange(e.target.value, endDate));
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-[#1A73E8] focus:bg-white transition-colors"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="range-end"
              className="text-[10px] font-medium text-gray-500 uppercase tracking-wide"
            >
              To
            </label>
            <input
              id="range-end"
              type="date"
              value={endDate}
              min={startDate}
              max={today}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedPreset("custom");
                setSparklineData(getCountsForRange(startDate, e.target.value));
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-[#1A73E8] focus:bg-white transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={exportSearchCSV}
            data-ocid="monetization.revenue.export_button"
            title="Export Selected Range"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A73E8] rounded-lg hover:bg-[#1557B0] transition-colors shadow-sm"
          >
            <Download size={12} />
            Export
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            type="button"
            title="Start fresh for today"
            data-ocid="monetization.revenue.delete_button"
            className="h-[30px] w-[30px] flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Reset confirmation dialog */}
        {showResetConfirm && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3"
            data-ocid="monetization.revenue.dialog"
          >
            <p className="text-sm text-red-800 font-medium">
              Reset today's search data?
            </p>
            <p className="text-xs text-red-600">
              This cannot be undone. Today's search count will be set to zero.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                data-ocid="monetization.revenue.cancel_button"
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={resetTodayCount}
                data-ocid="monetization.revenue.confirm_button"
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Main stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-black text-white">
              {todayTotal.toLocaleString()}
            </p>
            <p className="text-xs text-blue-100 mt-1">Total Searches Today</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-gray-800">
              ${((todayTotal / 1000) * rpm).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Estimated Earnings</p>
          </div>
        </div>

        {/* Sparkline — dynamic date range */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            {selectedPreset === "today"
              ? "Search Volume — Last 24 Hours"
              : selectedPreset === "7d"
                ? "Search Volume — Last 7 Days"
                : selectedPreset === "month"
                  ? "Search Volume — This Month"
                  : `Search Volume — ${startDate} to ${endDate}`}
          </p>
          <div className="bg-gray-50 rounded-xl p-3">
            <SparklineChart data={sparklineData} />
          </div>
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-gray-400">
              {selectedPreset === "today" ? "24h ago" : startDate}
            </span>
            <span className="text-[10px] text-gray-400">
              {selectedPreset === "today" ? "Now" : endDate}
            </span>
          </div>
        </div>

        {/* RPM input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="rpm-input"
            className="text-sm font-medium text-gray-700"
          >
            RPM (Revenue Per Mille)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-medium">$</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rpm}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value) || 0;
                setRpm(v);
                localStorage.setItem("aflino_rpm", String(v));
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50"
              placeholder="e.g. 2.50"
              id="rpm-input"
              data-ocid="monetization.rpm.input"
            />
          </div>
          <p className="text-xs text-gray-400">
            Estimated earnings = (Searches / 1000) × RPM
          </p>
        </div>

        {/* Refresh note */}
        <p className="text-[11px] text-gray-400 text-center">
          Auto-refreshes every 30 seconds · Data stored locally
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem("aflino_admin_auth") === "1",
  );
  const [activeSection, setActiveSection] = useState<Section>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("aflino_admin_auth");
    setAuthed(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-800">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="text-blue-700" size={18} />
        </div>
        <span className="text-white font-bold text-base tracking-tight">
          Aflino Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-ocid={`admin.nav.${item.id}.link`}
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
            className={[
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              activeSection === item.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-blue-100 hover:bg-blue-700 hover:text-white",
            ].join(" ")}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-blue-800 pt-4">
        <button
          type="button"
          data-ocid="admin.nav.logout.button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900 hover:text-red-200 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-blue-700 flex-col fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm w-full h-full border-0 cursor-default"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-blue-700 flex flex-col z-50 shadow-2xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-blue-200 hover:text-white"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 bg-blue-700 px-4 py-3 sticky top-0 z-20">
          <button
            type="button"
            data-ocid="admin.sidebar.open_modal_button"
            onClick={() => setSidebarOpen(true)}
            className="text-white"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="text-white" size={18} />
            <span className="text-white font-bold text-base">Aflino Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "shortcuts" && <ShortcutsManager />}
          {activeSection === "languages" && <LanguageManagerSection />}
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "settings" && <SettingsSection />}
          {activeSection === "users" && <UserDatabaseSection />}
          {activeSection === "wallet" && <DomainPartnersSection />}
          {activeSection === "globalControls" && <GlobalControlsSection />}
          {activeSection === "security" && <SecurityStatusPanel />}
          {activeSection === "legalCms" && <LegalCmsSection />}
          {activeSection === "monetization" && <MonetizationApiSection />}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
