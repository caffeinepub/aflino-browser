import {
  Archive,
  Clipboard,
  Eye,
  Flame,
  Globe,
  LayoutGrid,
  Lock,
  ScanText,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type SearchHistoryLogEntry,
  useShortcutsStore,
} from "../../useShortcutsStore";

const BLUE = "#1A73E8";

const visitorsData = [
  { day: "Mar 1", visitors: 1024 },
  { day: "Mar 5", visitors: 1497 },
  { day: "Mar 10", visitors: 1109 },
  { day: "Mar 15", visitors: 1176 },
  { day: "Mar 20", visitors: 1643 },
  { day: "Mar 25", visitors: 1401 },
  { day: "Mar 27", visitors: 1702 },
];

const shortcutClicksData = [
  { name: "YouTube", clicks: 3240 },
  { name: "Facebook", clicks: 2180 },
  { name: "Amazon", clicks: 1950 },
  { name: "Gmail", clicks: 1720 },
  { name: "Instagram", clicks: 1540 },
  { name: "LinkedIn", clicks: 890 },
];

function SectionHeader({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function SearchHistoryTable({ entries }: { entries: SearchHistoryLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        No searches recorded yet.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 pr-3 text-gray-500 font-semibold">
              Date
            </th>
            <th className="text-left py-2 pr-3 text-gray-500 font-semibold">
              Query
            </th>
            <th className="text-left py-2 pr-3 text-gray-500 font-semibold">
              Engine
            </th>
            <th className="text-left py-2 text-gray-500 font-semibold">User</th>
          </tr>
        </thead>
        <tbody>
          {entries.slice(0, 20).map((e) => (
            <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-1.5 pr-3 text-gray-400">{e.date}</td>
              <td className="py-1.5 pr-3 text-gray-800 max-w-[140px] truncate">
                {e.query}
              </td>
              <td className="py-1.5 pr-3 text-gray-500 capitalize">
                {e.engine}
              </td>
              <td className="py-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    background:
                      e.userType === "Logged-in" ? "#EBF3FE" : "#F3F4F6",
                    color: e.userType === "Logged-in" ? BLUE : "#6B7280",
                  }}
                >
                  {e.userType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color = BLUE,
}: {
  label: string;
  value: string | number;
  sub: string;
  color?: string;
}) {
  return (
    <div
      data-ocid="admin.analytics.card"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1"
    >
      <span className="text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <span className="text-xs text-gray-400">{sub}</span>
    </div>
  );
}

const FEATURES = [
  {
    tag: "ghostMode",
    label: "Ghost Mode",
    icon: <Flame size={16} className="text-orange-500" />,
  },
  {
    tag: "ocr",
    label: "OCR & Translate",
    icon: <ScanText size={16} className="text-blue-500" />,
  },
  {
    tag: "dataSaver",
    label: "Data Saver",
    icon: <Zap size={16} className="text-green-500" />,
  },
  {
    tag: "zenMode",
    label: "Zen Mode",
    icon: <Eye size={16} className="text-purple-500" />,
  },
  {
    tag: "clipboard",
    label: "Magic Clipboard",
    icon: <Clipboard size={16} className="text-yellow-600" />,
  },
  {
    tag: "splitView",
    label: "Split View",
    icon: <LayoutGrid size={16} className="text-sky-500" />,
  },
  {
    tag: "vault",
    label: "App Vault",
    icon: <Lock size={16} className="text-slate-600" />,
  },
  {
    tag: "speedDial",
    label: "Speed Dial",
    icon: <Globe size={16} className="text-indigo-500" />,
  },
  {
    tag: "backup",
    label: "Backup & Restore",
    icon: <Archive size={16} className="text-emerald-600" />,
  },
];

function FeatureEngagementCard({
  featureAnalytics,
}: { featureAnalytics: Record<string, number> }) {
  const sorted = [...FEATURES].sort(
    (a, b) => (featureAnalytics[b.tag] ?? 0) - (featureAnalytics[a.tag] ?? 0),
  );

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck size={18} className="text-blue-500" />
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Feature Analytics (Internal)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Admin only — article reads per feature
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map(({ tag, label, icon }) => {
          const count = featureAnalytics[tag] ?? 0;
          return (
            <div
              key={tag}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <span className="flex-1 text-sm text-gray-700">{label}</span>
              {count > 0 ? (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "#1A73E8" }}
                >
                  {count}
                </span>
              ) : (
                <span className="text-sm text-gray-300">—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  const {
    searchCount,
    appInstalls,
    activeAppUsersToday,
    appDailyClicks,
    webVisitorsTotal,
    searchHistoryLog,
    featureAnalytics,
  } = useShortcutsStore();

  const estimatedRevenue = (searchCount * 0.05).toFixed(2);

  return (
    <div data-ocid="admin.analytics.panel" className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track app and web performance metrics.
        </p>
      </div>

      {/* Part A: App Analytics */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
        <SectionHeader title="App Analytics" subtitle="PWA / Installed Users" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Total App Installs"
            value={appInstalls}
            sub="Lifetime PWA installations"
          />
          <MetricCard
            label="Active App Users"
            value={activeAppUsersToday}
            sub="Opened via home screen today"
          />
          <MetricCard
            label="In-App Engagement"
            value={`${appDailyClicks} clicks`}
            sub="Daily clicks inside the app"
          />
        </div>
      </div>

      {/* Part B: Web Analytics */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader
          title="Web Analytics"
          subtitle="Browser / URL Visitors"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <MetricCard
            label="Total Web Visitors"
            value={webVisitorsTotal}
            sub="Non-PWA visits via URL"
          />
          <MetricCard
            label="Search Volume"
            value={searchCount}
            sub="Total searches across all engines"
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            Search History Log
          </h3>
          <SearchHistoryTable entries={searchHistoryLog} />
        </div>
      </div>

      {/* Estimated Revenue */}
      <div
        data-ocid="admin.analytics.search_revenue.card"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-gray-800">
              Estimated Search Revenue
            </h2>
            <p className="text-xs text-gray-400">
              Based on search activity (demo)
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: BLUE }}>
              ${estimatedRevenue}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total Searches: {searchCount}
            </p>
          </div>
          <span
            className="text-xs font-bold px-2 py-1 rounded-md"
            style={{ background: "#EBF3FD", color: BLUE }}
          >
            DEMO
          </span>
        </div>
      </div>

      {/* Traffic Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader
          title="Traffic Overview"
          subtitle="Visitors and shortcut performance"
        />
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Visitors Over Time
          </h3>
          <p className="text-xs text-gray-400 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={visitorsData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke={BLUE}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: BLUE, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Top Clicked Shortcuts
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Most visited shortcuts by click count
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={shortcutClicksData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#eff6ff" }}
              />
              <Bar
                dataKey="clicks"
                fill={BLUE}
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Engagement */}
      <FeatureEngagementCard featureAnalytics={featureAnalytics} />
    </div>
  );
}
