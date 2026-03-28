import { MapPin, ShieldAlert } from "lucide-react";
import {
  DEFAULT_COUNTRY_CONFIGS,
  useShortcutsStore,
} from "../../useShortcutsStore";

export function GlobalControlsSection() {
  const {
    countryConfigs,
    updateCountryConfig,
    detectedCountry,
    vpnDetected,
    rewardsEnabled,
  } = useShortcutsStore();

  return (
    <div className="space-y-6" data-ocid="global_controls.section">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "#EBF3FD" }}
        >
          <MapPin size={20} style={{ color: "#1A73E8" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Global Rewards Controls
          </h2>
          <p className="text-sm text-gray-500">
            Manage reward eligibility and currency settings per country.
          </p>
        </div>
      </div>

      {/* Country Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Table Header (desktop) */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>Country</span>
          <span className="text-center">Status</span>
          <span className="text-center">Currency</span>
          <span className="text-center">Coin Value</span>
          <span className="text-center">Min Redeem</span>
        </div>

        <div className="divide-y divide-gray-50">
          {countryConfigs.map((country, idx) => (
            <div
              key={country.countryCode}
              className="px-4 py-3"
              data-ocid={`global_controls.item.${idx + 1}`}
            >
              {/* Mobile: stacked layout */}
              <div className="flex items-center justify-between gap-2 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                {/* Country name */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{country.flag}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {country.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {country.countryCode}
                    </p>
                  </div>
                </div>

                {/* Status toggle */}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      updateCountryConfig(country.countryCode, {
                        status: !country.status,
                      })
                    }
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                    style={{
                      background: country.status ? "#1A73E8" : "#D1D5DB",
                    }}
                    data-ocid={`global_controls.toggle.${idx + 1}`}
                    aria-label={`Toggle rewards for ${country.name}`}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: country.status
                          ? "translateX(18px)"
                          : "translateX(2px)",
                      }}
                    />
                  </button>
                </div>

                {/* Currency Symbol */}
                <div className="flex items-center justify-center">
                  <input
                    type="text"
                    maxLength={4}
                    value={country.currencySymbol}
                    onChange={(e) =>
                      updateCountryConfig(country.countryCode, {
                        currencySymbol: e.target.value,
                      })
                    }
                    className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm font-mono outline-none focus:border-[#1A73E8]"
                    data-ocid={`global_controls.input.${idx + 1}`}
                  />
                </div>

                {/* Coin Value */}
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={country.coinValue}
                    onChange={(e) =>
                      updateCountryConfig(country.countryCode, {
                        coinValue: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm outline-none focus:border-[#1A73E8]"
                    data-ocid={`global_controls.input.${idx + 1}`}
                  />
                </div>

                {/* Min Redemption */}
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={country.minRedemption}
                    onChange={(e) =>
                      updateCountryConfig(country.countryCode, {
                        minRedemption: Number.parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm outline-none focus:border-[#1A73E8]"
                    data-ocid={`global_controls.input.${idx + 1}`}
                  />
                </div>
              </div>

              {/* Mobile labels */}
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 md:hidden">
                <span>Symbol: {country.currencySymbol}</span>
                <span>
                  1 Coin = {country.coinValue} {country.currencySymbol}
                </span>
                <span>Min: {country.minRedemption} coins</span>
                <span
                  className="font-semibold"
                  style={{ color: country.status ? "#16A34A" : "#DC2626" }}
                >
                  {country.status ? "Rewards ON" : "Rewards OFF"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VPN Security card */}
      <div
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        data-ocid="global_controls.panel"
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "#FEF3C7" }}
          >
            <ShieldAlert size={18} style={{ color: "#D97706" }} />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-bold text-gray-900">
              VPN / Proxy Shield
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              When a high-risk VPN or proxy is detected, rewards are
              automatically disabled for that session. This cannot be overridden
              by the user.
            </p>
            <div className="mt-2">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                Auto-enforced — no configuration needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Detection Status (debug card for admin) */}
      <div
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        data-ocid="global_controls.card"
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: detectedCountry ? "#16A34A" : "#9CA3AF" }}
          />
          <h3 className="text-sm font-bold text-gray-900">
            Live Detection Status
          </h3>
          <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            Admin Debug
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-400 mb-1">Detected Country</p>
            <p className="text-sm font-bold text-gray-800">
              {detectedCountry
                ? (() => {
                    const cfg = DEFAULT_COUNTRY_CONFIGS.find(
                      (c) => c.countryCode === detectedCountry,
                    );
                    return cfg ? `${cfg.flag} ${cfg.name}` : detectedCountry;
                  })()
                : "Detecting…"}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-400 mb-1">VPN / Proxy</p>
            <p
              className="text-sm font-bold"
              style={{ color: vpnDetected ? "#DC2626" : "#16A34A" }}
            >
              {vpnDetected ? "⚠️ Detected" : "✓ Not detected"}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 col-span-2">
            <p className="text-xs text-gray-400 mb-1">Rewards Status</p>
            <p
              className="text-sm font-bold"
              style={{ color: rewardsEnabled ? "#1A73E8" : "#DC2626" }}
            >
              {rewardsEnabled
                ? "✓ Enabled for this session"
                : "✗ Disabled for this session"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
