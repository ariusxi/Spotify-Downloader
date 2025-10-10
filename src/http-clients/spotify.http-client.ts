import axios, { AxiosResponse } from 'axios';
import { SpotifyArtist, SpotifyTrack } from './types/spotify.interface';

class SpotifyHttpClient {
  private readonly user = process.env.SPOTIFY_CLIENT_ID;
  private readonly pass = process.env.SPOTIFY_CLIENT_SECRET;
  private readonly url = process.env.SPOTIFY_API_URL;

  private getUserToken(): string {
    const token = Buffer.from(`${this.user}:${this.pass}`).toString('base64');
    
    return token;
  }

  public async getToken(): Promise<string> {
    const payload = 'grant_type=client_credentials';
    const token = this.getUserToken();

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${token}`,
        }
      });

      return response.data.access_token;
    } catch (error) {
      throw new Error('Falha ao efetuar autenticação');
    }
  }

  public async fetchAllPlaylistTracks(playlistId: string, limit = 100): Promise<SpotifyTrack[]> {
    const token = await this.getToken();

    try {
      const response = await axios.get(`${this.url}/playlists/${playlistId}/tracks?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.items;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 404) {
        throw new Error(`Playlist não encontrada ou privada (id: ${playlistId})`);
      }
      throw new Error(`Falha ao resgatar informações de playlist: ${playlistId}`);
    }
  }

  public async getArtistsMetadata(artistId: string): Promise<SpotifyArtist> {
    const token = await this.getToken();

    try {
      const response = await axios.get(`${this.url}/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 404) {
        throw new Error(`Artista não encontrado ou privada (id: ${artistId})`);
      }
      throw new Error(`Falha ao resgatar informações de artista: ${artistId}`);
    }
  }

}

export default new SpotifyHttpClient();