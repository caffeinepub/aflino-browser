import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Shield,
  ShieldOff,
  Wallet,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Coupon, useShortcutsStore } from "../useShortcutsStore";

const COIN_VALUES = [50, 100, 200, 500];

function getDaysRemaining(valid_until: number) {
  const diff = valid_until - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function RevealCodeModal({
  coupon,
  onClose,
}: {
  coupon: Coupon;
  onClose: () => void;
}) {
  const { revealCoupon } = useShortcutsStore();
  const [password, setPassword] = useState("");
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleReveal() {
    const result = revealCoupon(coupon.id, password);
    if (result.success && result.code) {
      setRevealedCode(result.code);
      setError("");
    } else {
      setError(result.error || "Failed to reveal code");
    }
  }

  function handleCopy() {
    if (revealedCode) {
      navigator.clipboard.writeText(revealedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Code copied to clipboard!");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        data-ocid="wallet.dialog"
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "#EBF3FD" }}
          >
            <Shield size={20} style={{ color: "#1A73E8" }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Verify Identity</h3>
            <p className="text-xs text-gray-500">
              Enter your password to reveal the code
            </p>
          </div>
        </div>

        {!revealedCode ? (
          <>
            <input
              type="password"
              placeholder="Your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReveal()}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
              data-ocid="wallet.input"
            />
            {error && (
              <p
                className="mt-2 text-xs text-red-500"
                data-ocid="wallet.error_state"
              >
                {error}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600"
                data-ocid="wallet.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReveal}
                disabled={!password}
                className="flex-1 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                style={{ background: "#1A73E8" }}
                data-ocid="wallet.confirm_button"
              >
                Reveal
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "#EBF3FD" }}
              data-ocid="wallet.success_state"
            >
              <p className="mb-1 text-xs font-semibold text-gray-500">
                Your Coupon Code
              </p>
              <p
                className="font-mono text-xl font-bold tracking-widest"
                style={{ color: "#1A73E8" }}
              >
                {revealedCode}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
                style={{ background: "#1A73E8" }}
                data-ocid="wallet.primary_button"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600"
                data-ocid="wallet.close_button"
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function GenerateCouponModal({ onClose }: { onClose: () => void }) {
  const { walletBalance, generateCoupon, currentUser } = useShortcutsStore();
  const [selectedValue, setSelectedValue] = useState(100);
  const [generated, setGenerated] = useState<Coupon | null>(null);

  function handleGenerate() {
    const coupon = generateCoupon(selectedValue);
    if (coupon) {
      setGenerated(coupon);
      toast.success(`Coupon for ₹${selectedValue} generated!`);
    } else {
      toast.error("Insufficient balance.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        data-ocid="wallet.modal"
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "#EBF3FD" }}
          >
            <Wallet size={20} style={{ color: "#1A73E8" }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Generate Coupon</h3>
            <p className="text-xs text-gray-500">
              Balance: ₹{walletBalance} coins
            </p>
          </div>
        </div>

        {!generated ? (
          <>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Select Value
            </p>
            <div className="mb-5 grid grid-cols-2 gap-2">
              {COIN_VALUES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedValue(v)}
                  disabled={walletBalance < v}
                  className="rounded-xl border-2 py-3 text-sm font-bold transition-all disabled:opacity-40"
                  style={{
                    borderColor: selectedValue === v ? "#1A73E8" : "#E5E7EB",
                    color: selectedValue === v ? "#1A73E8" : "#374151",
                    background: selectedValue === v ? "#EBF3FD" : "white",
                  }}
                  data-ocid={`wallet.item.${COIN_VALUES.indexOf(v) + 1}`}
                >
                  ₹{v}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600"
                data-ocid="wallet.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!currentUser || walletBalance < selectedValue}
                className="flex-1 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                style={{ background: "#1A73E8" }}
                data-ocid="wallet.primary_button"
              >
                Generate
              </button>
            </div>
          </>
        ) : (
          <div className="text-center" data-ocid="wallet.success_state">
            <div className="mb-3 flex justify-center">
              <CheckCircle2 size={40} style={{ color: "#1A73E8" }} />
            </div>
            <p className="mb-1 font-bold text-gray-900">Coupon Created!</p>
            <p className="mb-4 text-sm text-gray-500">
              Your code is masked for security. Tap "Reveal Code" to view it.
            </p>
            <div
              className="mb-4 rounded-xl p-3"
              style={{ background: "#EBF3FD" }}
            >
              <p className="font-mono text-xl font-bold tracking-widest text-gray-400">
                ••••-••••-••••
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl py-3 text-sm font-bold text-white"
              style={{ background: "#1A73E8" }}
              data-ocid="wallet.close_button"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: Coupon["status"] }) {
  const configs = {
    ACTIVE: {
      bg: "#DCFCE7",
      color: "#16A34A",
      icon: <CheckCircle2 size={12} />,
    },
    USED: { bg: "#F3F4F6", color: "#6B7280", icon: <XCircle size={12} /> },
    EXPIRED: { bg: "#FEE2E2", color: "#DC2626", icon: <Clock size={12} /> },
    REFUNDED: {
      bg: "#EBF3FD",
      color: "#1A73E8",
      icon: <RefreshCw size={12} />,
    },
  };
  const c = configs[status];
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ background: c.bg, color: c.color }}
    >
      {c.icon} {status}
    </span>
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [showReveal, setShowReveal] = useState(false);
  const daysLeft = getDaysRemaining(coupon.valid_until);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="mb-1.5 font-mono text-lg font-bold tracking-widest text-gray-300">
              ••••-••••-••••
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={coupon.status} />
              <span className="text-xs text-gray-500">
                ₹{coupon.value} coins
              </span>
            </div>
          </div>
          {coupon.status === "ACTIVE" && (
            <button
              type="button"
              onClick={() => setShowReveal(true)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white"
              style={{ background: "#1A73E8" }}
              data-ocid="wallet.primary_button"
            >
              <Eye size={13} /> Reveal
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {coupon.status === "ACTIVE" && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {daysLeft > 0 ? `${daysLeft}d remaining` : "Expires today"}
            </span>
          )}
          <span>
            Valid until {new Date(coupon.valid_until).toLocaleDateString()}
          </span>
        </div>

        {coupon.status === "USED" && coupon.usedAtDomain && (
          <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-500">
            Used at{" "}
            <span className="font-semibold text-gray-700">
              {coupon.usedAtDomain}
            </span>
            {coupon.orderId && <> · Order #{coupon.orderId}</>}
            {coupon.usedAt && (
              <> · {new Date(coupon.usedAt).toLocaleDateString()}</>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showReveal && (
          <RevealCodeModal
            coupon={coupon}
            onClose={() => setShowReveal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function SafeGuardWallet() {
  const {
    walletBalance,
    coupons,
    currentUser,
    rewardsEnabled,
    vpnDetected,
    detectedCountry,
    countryConfigs,
  } = useShortcutsStore();
  const [showGenerate, setShowGenerate] = useState(false);

  const currentConfig =
    countryConfigs.find((c) => c.countryCode === detectedCountry) ??
    countryConfigs.find((c) => c.countryCode === "OTHER");
  const currencySymbol = currentConfig?.currencySymbol ?? "₹";

  if (!rewardsEnabled) {
    return (
      <div
        className="flex flex-col items-center justify-center px-6 py-16 text-center"
        data-ocid="wallet.empty_state"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ShieldOff size={32} className="text-gray-400" />
        </div>
        <h3 className="mb-2 font-bold text-gray-700">Rewards Unavailable</h3>
        <p className="text-sm text-gray-500">
          {vpnDetected
            ? "A VPN or proxy was detected. Disable it to use your wallet."
            : "Aflino Rewards are not available in your region."}
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "#EBF3FD" }}
        >
          <Shield size={32} style={{ color: "#1A73E8" }} />
        </div>
        <h3 className="mb-2 font-bold text-gray-900">Safe-Guard Wallet</h3>
        <p className="text-sm text-gray-500">
          Login to your Aflino account to use Safe-Guard Wallet.
        </p>
        <div
          className="mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white"
          style={{ background: "#1A73E8" }}
          data-ocid="wallet.primary_button"
        >
          Login Required
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header card */}
      <div
        className="flex items-center justify-between rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, #1A73E8, #0d5bcd)" }}
        data-ocid="wallet.card"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-100">
              Safe-Guard Wallet
            </p>
            <p className="text-xl font-bold text-white">
              {currencySymbol}
              {walletBalance}
            </p>
            <p className="text-xs text-blue-200">coins available</p>
            {currentConfig && (
              <p className="text-xs text-blue-200 mt-0.5">
                🌍 {currentConfig.name} · 1 coin = {currentConfig.coinValue}{" "}
                {currentConfig.currencySymbol}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/30"
          data-ocid="wallet.primary_button"
        >
          <Plus size={16} /> Generate
        </button>
      </div>

      {/* Coupons list */}
      <div>
        <h4 className="mb-3 text-sm font-bold text-gray-700">My Coupons</h4>
        {coupons.length === 0 ? (
          <div
            className="rounded-2xl border-2 border-dashed border-gray-100 p-8 text-center"
            data-ocid="wallet.empty_state"
          >
            <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">
              No coupons yet. Generate one to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon, idx) => (
              <div key={coupon.id} data-ocid={`wallet.item.${idx + 1}`}>
                <CouponCard coupon={coupon} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showGenerate && (
          <GenerateCouponModal onClose={() => setShowGenerate(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
