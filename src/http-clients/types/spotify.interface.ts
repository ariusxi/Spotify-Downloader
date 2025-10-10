export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  name: string;
}

export interface SpotifyExternalId {
  isrc?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  coverUrl: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_ids?: SpotifyExternalId[];
}