import React from "react";
import Icon from "components/AppIcon";

const SummaryWidget = ({ title, value, subtitle, icon, trend, trendValue, accentColor }) => {
  const isPositive = trend === "up";

  return (
    <div
      className="rounded-xl p-4 md:p-5 lg:p-6 flex flex-col gap-3 min-w-0"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
          }}
        >
          <Icon name={icon} size={20} color={accentColor} strokeWidth={1.8} />
        </div>
        {trendValue !== undefined && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
            style={{
              background: isPositive ? "rgba(78,205,196,0.12)" : "rgba(255,142,142,0.12)",
              color: isPositive ? "var(--color-success)" : "var(--color-error)",
              fontFamily: "var(--font-data)",
            }}
          >
            <Icon
              name={isPositive ? "TrendingUp" : "TrendingDown"}
              size={11}
              color={isPositive ? "var(--color-success)" : "var(--color-error)"}
              strokeWidth={2.5}
            />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p
          className="text-3xl md:text-4xl font-bold leading-none"
          style={{ fontFamily: "var(--font-data)", color: accentColor }}
        >
          {value}
        </p>
        <p
          className="text-sm font-semibold mt-1"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryWidget;