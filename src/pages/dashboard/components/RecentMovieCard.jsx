import React from "react";
import { useCurrency } from "context/CurrencyContext";
import { useMoviePoster } from "utils/useMoviePoster";

const RecentMovieCard = ({ movie }) => {
  const { formatCurrency } = useCurrency();
  const poster = useMoviePoster(movie?.name);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
    >
      {poster ? (
        <img src={poster} alt={movie?.name} className="flex-shrink-0 rounded-md object-cover"
          style={{ width: 30, height: 44, background: "var(--color-surface-2)" }}
          onError={(e) => { e.target.style.display='none'; }} />
      ) : (
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{ background: "rgba(212,175,55,0.12)", color: "var(--color-primary)", fontFamily: "var(--font-data)" }}>
          {movie?.index}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>{movie?.name}</p>
        <p className="text-xs truncate" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
          {movie?.theatre} &bull; {movie?.date}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {movie?.openingDay && <span className="text-xs px-1.5 py-0.5 rounded hidden sm:block" style={{ background:"rgba(255,107,107,0.15)",color:"var(--color-accent)",fontFamily:"var(--font-caption)" }}>{movie?.openingShow ? "FDFS" : "Opening Day"}</span>}
        {movie?.is3D && <span className="text-xs px-1.5 py-0.5 rounded hidden sm:block" style={{ background:"rgba(212,175,55,0.12)",color:"var(--color-primary)",fontFamily:"var(--font-caption)" }}>3D</span>}
        <span className="text-sm font-semibold" style={{ fontFamily:"var(--font-data)",color:"var(--color-primary)" }}>{formatCurrency(movie?.totalCost)}</span>
      </div>
    </div>
  );
};
export default RecentMovieCard;
