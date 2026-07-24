import React from "react";
import Icon from "components/AppIcon";

const StatRow = ({ label, value, icon, color }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon name={icon} size={14} color={color} strokeWidth={2} />
      </div>
      <span
        className="text-sm truncate"
        style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
    </div>
    <span
      className="text-sm font-semibold whitespace-nowrap flex-shrink-0"
      style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}
    >
      {value}
    </span>
  </div>
);

const QuickStats = ({ stats }) => {
  return (
    <div
      className="rounded-xl p-4 md:p-5 lg:p-6 min-w-0"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Zap" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Quick Stats
        </h3>
      </div>
      <div>
        {stats?.map((stat, i) => (
          <StatRow key={i} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default QuickStats;