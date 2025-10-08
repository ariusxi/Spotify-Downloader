import axios from 'axios';

class YoutubeHttpClient {
  private url = process.env.YOUTUBE_API_URL;
  private token = process.env.YOUTUBE_API_KEY;

  public async searchVideo(query: string): Promise<string> {
    try {
      const response = await axios.get(`${this.url}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          key: this.token,
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      return response.data.items[0].id.videoId;
    } catch {
      return null;
    }
  }

}

export default new YoutubeHttpClient();