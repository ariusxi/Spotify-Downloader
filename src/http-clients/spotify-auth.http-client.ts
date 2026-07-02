import axios from 'axios';

class SpotifyAuthClient {
  private readonly user = process.env.SPOTIFY_CLIENT_ID;
  private readonly pass = process.env.SPOTIFY_CLIENT_SECRET;

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
}

export default new SpotifyAuthClient();
