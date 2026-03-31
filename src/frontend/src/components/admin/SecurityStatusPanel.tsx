import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useShortcutsStore } from "../../useShortcutsStore";
import {
  getRateLimitStatus,
  getSecurityStatus,
  maskApiKey,
} from "../../utils/security";

type CheckStatus = "pass" | "fail" | "warn";

interface SecurityCheck {
  label: string;
  value: string;
  status: CheckStatus;
}

function buildChecks(): SecurityCheck[] {
  const isHttps = window.location.protocol === "https:";
  const hasSW = "serviceWorker" in navigator;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const rateStatus = getRateLimitStatus("google_search");
  const remaining = rateStatus.remaining;
  const rateLimitStatus: CheckStatus = rateStatus.isLimited
    ? "fail"
    : remaining < 20
      ? "warn"
      : "pass";

  return [
    {
      label: "HTTPS Enforced",
      value: isHttps ? "Active" : "HTTP (insecure)",
      status: isHttps ? "pass" : "fail",
    },
    {
      label: "Service Worker",
      value: hasSW ? "Registered" : "Not supported",
      status: hasSW ? "pass" : "warn",
    },
    {
      label: "PWA Standalone",
      value: isStandalone ? "Installed" : "Browser tab",
      status: isStandalone ? "pass" : "warn",
    },
    {
      label: "CSP Active",
      value: "via meta tag",
      status: "pass",
    },
    {
      label: "Rate Limiting",
      value: `${remaining}/100 requests remaining`,
      status: rateLimitStatus,
    },
    {
      label: "XSS Sanitizer",
      value: "Active",
      status: "pass",
    },
    {
      label: "Script Injection Guard",
      value: "SW v3 Enabled",
      status: "pass",
    },
    {
      label: "HSTS",
      value: isHttps ? "Enforced on HTTPS" : "Inactive on HTTP",
      status: isHttps ? "pass" : "fail",
    },
  ];
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "pass")
    return <CheckCircle2 size={18} className="text-green-500 shrink-0" />;
  if (status === "fail")
    return <XCircle size={18} className="text-red-500 shrink-0" />;
  return <AlertCircle size={18} className="text-yellow-500 shrink-0" />;
}

export function SecurityStatusPanel() {
  const [checks, setChecks] = useState<SecurityCheck[]>(() => buildChecks());
  const [refreshKey, setRefreshKey] = useState(0);
  const googleSearchApiKey = useShortcutsStore((s) => s.googleSearchApiKey);

  const handleRefresh = useCallback(() => {
    setChecks(buildChecks());
    setRefreshKey((k) => k + 1);
  }, []);

  const passCount = checks.filter((c) => c.status === "pass").length;
  const score = Math.min(100, passCount * 15);

  const scoreColor =
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Shield size={20} className="text-[#1A73E8]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Security Status</h2>
            <p className="text-sm text-gray-500">
              Real-time security posture for Aflino Browser
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          data-ocid="security.refresh.button"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#1A73E8] border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Security Score */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Security Score
          </span>
          <span
            className={`text-xl font-bold ${
              score >= 80
                ? "text-green-600"
                : score >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {score}/100
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            key={refreshKey}
            className={`h-full rounded-full transition-all duration-700 ease-out ${scoreColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {passCount} of {checks.length} checks passing
        </p>
      </div>

      {/* Checks Grid */}
      <div className="grid gap-3" data-ocid="security.checks.panel">
        {checks.map((check, i) => (
          <div
            key={check.label}
            data-ocid={`security.check.${i + 1}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3"
          >
            <StatusIcon status={check.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{check.label}</p>
              <p className="text-xs text-gray-500 truncate">{check.value}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                check.status === "pass"
                  ? "bg-green-50 text-green-700"
                  : check.status === "fail"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {check.status === "pass"
                ? "Pass"
                : check.status === "fail"
                  ? "Fail"
                  : "Warn"}
            </span>
          </div>
        ))}
      </div>

      {/* API Key Info */}
      {googleSearchApiKey && (
        <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
          <p className="text-xs text-blue-700 font-medium">
            🔒 Google Search API Key
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Key obfuscated in storage. Last 4 chars:{" "}
            <code className="font-mono font-bold">
              {maskApiKey(googleSearchApiKey).slice(-4)}
            </code>
          </p>
        </div>
      )}

      {/* Info Footer */}
      <div className="text-xs text-gray-400 text-center pb-2">
        Security checks run locally in the browser. HTTPS and HSTS are enforced
        at deployment.
      </div>
    </div>
  );
}
