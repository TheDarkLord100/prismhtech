"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

type RangeKey = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

const RANGES: { label: RangeKey; days?: number }[] = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "ALL" },
];

interface Point {
  price_date: string; // YYYY-MM-DD
  price: number;
}

export function MetalHistoryChart({ metalId }: { metalId: string }) {
  const [allData, setAllData] = useState<Point[]>([]);
  const [range, setRange] = useState<RangeKey>("1M");
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch once ---------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/live-prices/${metalId}/history`, {
        cache: "no-store",
      });
      const json = await res.json();
      setAllData(json.history || []);
      setLoading(false);
    }
    load();
  }, [metalId]);

  /* ---------------- Frontend range filter ---------------- */
  const filteredData = useMemo(() => {
    const rangeConfig = RANGES.find((r) => r.label === range);
    if (!rangeConfig?.days) return allData;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeConfig.days);

    return allData.filter(
      (p) => new Date(p.price_date) >= cutoff
    );
  }, [allData, range]);

  /* ---------------- Price + trend ---------------- */
  const todayPrice = filteredData.at(-1)?.price ?? null;
  const yesterdayPrice =
    filteredData.length >= 2 ? filteredData.at(-2)?.price : null;

  const changePercent =
    todayPrice != null && yesterdayPrice != null
      ? ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100
      : null;

  const trend: "up" | "down" | "neutral" =
    todayPrice != null && yesterdayPrice != null
      ? todayPrice > yesterdayPrice
        ? "up"
        : todayPrice < yesterdayPrice
        ? "down"
        : "neutral"
      : "neutral";

  const COLORS = {
    up: "#4CAF50",
    down: "#E53935",
    neutral: "#9E9E9E",
  };

  const strokeColor = COLORS[trend];

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
        Loading chart…
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-3 text-black">
      {/* ---------------- PRICE SUMMARY ---------------- */}
      <div>
        <div className="text-xl font-semibold">
          ₹ {todayPrice?.toLocaleString("en-IN") ?? "—"}
        </div>

        {changePercent != null && (
          <div
            className={`text-sm ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {changePercent > 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        )}
      </div>

      {/* ---------------- RANGE FILTERS ---------------- */}
      <div className="flex border rounded-md overflow-hidden divide-x">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.label)}
            className={`flex-1 py-2 text-xs font-medium transition
              ${
                range === r.label
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ---------------- CHART ---------------- */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="price_date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <YAxis tickFormatter={(v) => `₹${v}`} />

            <Tooltip
              formatter={(v) =>
                v == null ? ["—", "Price"] : [`₹ ${v}`, "Price"]
              }
              labelFormatter={(l) =>
                new Date(l).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              fill="url(#trendFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
