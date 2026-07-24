import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Icon from "components/AppIcon";
import { useCurrency } from "context/CurrencyContext";

const SpendingBreakdown = ({ monthlyData, currentMonthIndex }) => {
  const { formatCurrency } = useCurrency();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            background: "var(--color-surface-3)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
            fontFamily: "var(--font-data)",
            color: "var(--color-text-primary)",
          }}
        >
          <p className="font-semibold">{label}</p>
          <p style={{ color: "var(--color-primary)" }}>{formatCurrency(payload?.[0]?.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-xl p-4 md:p-5 lg:p-6 min-w-0"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Icon name="BarChart2" size={18} color="var(--color-primary)" strokeWidth={1.8} />
          <h3
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            Monthly Spending
          </h3>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-md"
          style={{
            background: "rgba(212,175,55,0.1)",
            color: "var(--color-primary)",
            fontFamily: "var(--font-caption)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          2026
        </span>
      </div>
      <div className="w-full h-48 md:h-56" aria-label="Monthly spending bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(212,175,55,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-text-secondary)", fontSize: 11, fontFamily: "var(--font-caption)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-text-secondary)", fontSize: 11, fontFamily: "var(--font-data)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,175,55,0.06)" }} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {monthlyData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === currentMonthIndex ? "var(--color-primary)" : "var(--color-surface-3)"}
                  stroke={index === currentMonthIndex ? "rgba(212,175,55,0.4)" : "transparent"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingBreakdown;