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

export const extractTracksData = async (tracks): Promise<SpotifyTrack[]> => {
  const formattedTracks = tracks.map(({ track }) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => ({ name: artist.name })),
    album: { name: track.album.name },
    coverUrl: track.album.images[0]?.url,
    external_ids: track.external_ids,
  }));

  return formattedTracks;
}

export const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '')
    .replace(/:|;/g, '_');
}