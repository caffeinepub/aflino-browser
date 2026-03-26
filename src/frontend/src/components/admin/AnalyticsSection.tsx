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

const BLUE = "#1A73E8";

const visitorsData = [
  { day: "Mar 1", visitors: 1024 },
  { day: "Mar 2", visitors: 1182 },
  { day: "Mar 3", visitors: 943 },
  { day: "Mar 4", visitors: 1356 },
  { day: "Mar 5", visitors: 1497 },
  { day: "Mar 6", visitors: 1621 },
  { day: "Mar 7", visitors: 1388 },
  { day: "Mar 8", visitors: 1204 },
  { day: "Mar 9", visitors: 987 },
  { day: "Mar 10", visitors: 1109 },
  { day: "Mar 11", visitors: 1287 },
  { day: "Mar 12", visitors: 1445 },
  { day: "Mar 13", visitors: 1532 },
  { day: "Mar 14", visitors: 1398 },
  { day: "Mar 15", visitors: 1176 },
  { day: "Mar 16", visitors: 1067 },
  { day: "Mar 17", visitors: 1234 },
  { day: "Mar 18", visitors: 1389 },
  { day: "Mar 19", visitors: 1511 },
  { day: "Mar 20", visitors: 1643 },
  { day: "Mar 21", visitors: 1478 },
  { day: "Mar 22", visitors: 1312 },
  { day: "Mar 23", visitors: 1129 },
  { day: "Mar 24", visitors: 1267 },
  { day: "Mar 25", visitors: 1401 },
  { day: "Mar 26", visitors: 1588 },
  { day: "Mar 27", visitors: 1702 },
  { day: "Mar 28", visitors: 1544 },
  { day: "Mar 29", visitors: 1318 },
  { day: "Mar 30", visitors: 1247 },
];

const shortcutClicksData = [
  { name: "YouTube", clicks: 3240 },
  { name: "Facebook", clicks: 2180 },
  { name: "Amazon", clicks: 1950 },
  { name: "Gmail", clicks: 1720 },
  { name: "Instagram", clicks: 1540 },
  { name: "LinkedIn", clicks: 890 },
];

const keyMetrics = [
  { label: "Daily Visitors", value: "1,247", sub: "Today" },
  { label: "Weekly Visitors", value: "8,932", sub: "Last 7 days" },
  { label: "Monthly Visitors", value: "34,581", sub: "Last 30 days" },
  { label: "Total Shortcut Clicks", value: "12,450", sub: "All time" },
];

export function AnalyticsSection() {
  return (
    <div data-ocid="admin.analytics.panel" className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track visitor trends and shortcut performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => (
          <div
            key={metric.label}
            data-ocid="admin.analytics.card"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1"
          >
            <span className="text-2xl font-bold" style={{ color: BLUE }}>
              {metric.value}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {metric.label}
            </span>
            <span className="text-xs text-gray-400">{metric.sub}</span>
          </div>
        ))}
      </div>

      {/* Visitors Over Time */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Visitors Over Time
        </h2>
        <p className="text-xs text-gray-400 mb-5">Last 30 days</p>
        <ResponsiveContainer width="100%" height={220}>
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
              interval={4}
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              cursor={{ stroke: BLUE, strokeWidth: 1, strokeDasharray: "4 4" }}
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

      {/* Top Clicked Shortcuts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Top Clicked Shortcuts
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          Most visited shortcuts by click count
        </p>
        <ResponsiveContainer width="100%" height={220}>
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
  );
}
