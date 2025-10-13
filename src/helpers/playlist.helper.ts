import { SpotifyTrack } from "../http-clients/types/spotify.interface";

export const extractSpotifyId = (url: string): { actionType: string, actionId: string } | null => {
  const match = url.match(/(?:spotify:(\w+):|\/(\w+)\/)([a-zA-Z0-9]+)/);
  if (!match) return null;

  const actionType = match[1] || match[2];
  const actionId = match[3];

  return { actionType, actionId };
};

export const extractTracksPlaylistData = async (tracks): Promise<SpotifyTrack[]> => {
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

export const extractTracksAlbumData = async (album, tracks): Promise<SpotifyTrack[]> => {
  const formattedTracks = tracks.map((track) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => ({ name: artist.name })),
    album: { name: album.name },
    coverUrl: album.images[0].url,
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