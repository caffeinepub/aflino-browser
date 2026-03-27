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

function SearchHistoryTable({ entries }: { entries: SearchHistoryLogEntry[] }) {
  const latest = entries.slice(0, 50);
  if (latest.length === 0) {
    return (
      <div
        data-ocid="admin.analytics.search_history.empty_state"
        className="flex flex-col items-center py-10 text-gray-400"
      >
        <p className="text-sm">No search history yet.</p>
        <p className="text-xs mt-1">
          Searches will appear here as users browse.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Date", "Search Query", "Engine Used", "User Type"].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 pr-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {latest.map((entry, idx) => (
            <tr
              key={entry.id}
              data-ocid={`admin.analytics.search_history.item.${idx + 1}`}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="py-2.5 pr-4 text-xs text-gray-400 whitespace-nowrap">
                {new Date(entry.date).toLocaleDateString()}{" "}
                {new Date(entry.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="py-2.5 pr-4 text-sm text-gray-800 max-w-[180px] truncate">
                {entry.query}
              </td>
              <td className="py-2.5 pr-4">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                  style={{ background: "rgba(26,115,232,0.1)", color: BLUE }}
                >
                  {entry.engine}
                </span>
              </td>
              <td className="py-2.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    entry.userType === "Logged-in"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {entry.userType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

      {/* ─── Part A: App Analytics ─── */}
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

      {/* ─── Part B: Web Analytics ─── */}
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

        {/* Search History Log */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            Search History Log
          </h3>
          <SearchHistoryTable entries={searchHistoryLog} />
        </div>
      </div>

      {/* ─── Estimated Revenue ─── */}
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

      {/* ─── Traffic Overview ─── */}
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
    </div>
  );
}
