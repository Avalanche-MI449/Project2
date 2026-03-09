import React, { useState } from "react";

export default function MusicPreviewWidget() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchSong = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`
      );

      const data = await response.json();

      if (data.results.length > 0) {
        setTrack(data.results[0]);
      } else {
        setTrack(null);
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }

    setLoading(false);
  };

  return (
    <div className="music-widget">
      <h3>Music Preview</h3>

      <div>
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={searchSong}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {track && (
        <div className="song-preview">
          <img src={track.artworkUrl100} alt="album cover" />
          <h4>{track.trackName}</h4>
          <p>{track.artistName}</p>

          <audio controls src={track.previewUrl}>
            Your browser does not support audio.
          </audio>
        </div>
      )}
    </div>
  );
}