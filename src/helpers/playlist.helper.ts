import { SpotifyTrack } from "../http-clients/types/spotify.interface";

export const extractPlaylistId = (playlistUrl: string): string => {
  const playlistIndex = 1;
  const spotifyUrlMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
  if (spotifyUrlMatch) {
    return spotifyUrlMatch[playlistIndex];
  }

  const spotifyUriMatch = playlistUrl.match(/spotify:playlist:([a-zA-Z0-9]+)/);
  if (spotifyUriMatch) {
    return spotifyUriMatch[playlistIndex];
  }

  if (/^[a-zA-Z0-9]+$/.test(playlistUrl)) {
    return playlistUrl;
  }
  return null;
}

export const extractTracksData = (tracks): SpotifyTrack[] => {
  const formattedTracks = tracks.map(({ track }) => {
    const album = { name: track.album.name };
    const artists = track.artists.map((artist) => ({ name: artist.name }));
    
    return {
      id: track.id,
      name: track.name,
      artists,
      album,
      external_ids: track.external_ids,
    }
  });

  return formattedTracks;
}