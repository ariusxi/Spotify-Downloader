import axios from 'axios';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from './types/spotify.interface';
import SpotifyAuthClient from './spotify-auth.http-client';

class SpotifyHttpClient {
  private readonly url = process.env.SPOTIFY_API_URL;

  private async request<T>(url: string, notFoundMessage: string, failMessage: string): Promise<T> {
    const token = await SpotifyAuthClient.getToken();

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(notFoundMessage);
      }
      throw new Error(failMessage);
    }
  }

  public async fetchAllPlaylistTracks(playlistId: string, limit = 100): Promise<SpotifyTrack[]> {
    const data = await this.request<{ items: SpotifyTrack[] }>(
      `${this.url}/playlists/${playlistId}/tracks?limit=${limit}`,
      `Playlist não encontrada ou privada (id: ${playlistId})`,
      `Falha ao resgatar informações de playlist: ${playlistId}`,
    );

    return data.items;
  }

  public async fetchAlbumMetadata(albumId: string): Promise<SpotifyAlbum> {
    return this.request<SpotifyAlbum>(
      `${this.url}/albums/${albumId}`,
      `Álbum não encontrado (id: ${albumId})`,
      `Falha ao resgatar faixas do álbum: ${albumId}`,
    );
  }

  public async fetchAllAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
    const data = await this.request<{ items: SpotifyTrack[] }>(
      `${this.url}/albums/${albumId}/tracks`,
      `Álbum não encontrado (id: ${albumId})`,
      `Falha ao resgatar faixas do álbum: ${albumId}`,
    );

    return data.items;
  }

  public async getArtistsMetadata(artistId: string): Promise<SpotifyArtist> {
    return this.request<SpotifyArtist>(
      `${this.url}/artists/${artistId}`,
      `Artista não encontrado ou privada (id: ${artistId})`,
      `Falha ao resgatar informações de artista: ${artistId}`,
    );
  }

}

export default new SpotifyHttpClient();
