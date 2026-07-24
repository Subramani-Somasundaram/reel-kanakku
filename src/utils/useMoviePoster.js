import { useState, useEffect } from 'react';

const cache = {};

export function useMoviePoster(movieName) {
  const [poster, setPoster] = useState(null);
  const key = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    if (!movieName || !key || key === 'your-omdb-key-here') return;

    const cacheKey = movieName.toLowerCase().trim();
    if (cache[cacheKey] !== undefined) { setPoster(cache[cacheKey]); return; }

    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${key}&type=movie`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const url = (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') ? data.Poster : null;
        cache[cacheKey] = url;
        setPoster(url);
      })
      .catch(() => {
        cache[cacheKey] = null;
        setPoster(null);
      });
  }, [movieName, key]);

  return poster;
}
