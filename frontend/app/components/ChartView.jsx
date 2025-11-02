"use client";

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ChartView({ data, type = "radar" }) {
  if (!data || !data.metrics) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No chart data available
      </div>
    );
  }

  // Transform data for charts
  const radarData = Object.entries(data.metrics || {}).map(([key, value]) => ({
    metric: key.replace(/_/g, " ").toUpperCase(),
    score: typeof value === "number" ? value : 0,
    fullMark: 100,
  }));

  const barData = Object.entries(data.metrics || {}).map(([key, value]) => ({
    name: key.replace(/_/g, " ").substring(0, 15),
    value: typeof value === "number" ? value : 0,
  }));

  if (type === "radar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(79, 209, 197, 0.2)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "rgba(79, 209, 197, 0.8)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(79, 209, 197, 0.6)", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#4FD1C5"
            fill="#4FD1C5"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <XAxis
          dataKey="name"
          tick={{ fill: "rgba(79, 209, 197, 0.8)", fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "rgba(79, 209, 197, 0.8)", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(79, 209, 197, 0.3)",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#4FD1C5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

