import React from "react";
import Icon from "components/AppIcon";

const TopTheatres = ({ theatres }) => {
  const max = theatres?.[0]?.visits || 1;

  return (
    <div
      className="rounded-xl p-4 md:p-5 lg:p-6 min-w-0"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Building2" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Top Theatres
        </h3>
      </div>
      <div className="space-y-3">
        {theatres?.map((theatre, i) => (
          <div key={i} className="min-w-0">
            <div className="flex items-center justify-between mb-1 gap-2">
              <span
                className="text-sm truncate"
                style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-primary)" }}
              >
                {theatre?.name}
              </span>
              <span
                className="text-xs whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: "var(--font-data)", color: "var(--color-text-secondary)" }}
              >
                {theatre?.visits} visit{theatre?.visits > 1 ? "s" : ""}
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--color-surface-2)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(theatre?.visits / max) * 100}%`,
                  background:
                    i === 0
                      ? "var(--color-primary)"
                      : i === 1
                      ? "var(--color-secondary)"
                      : "var(--color-surface-3)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTheatres;