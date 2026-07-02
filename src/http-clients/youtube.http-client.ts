import ytSearch from 'yt-search';

class YoutubeHttpClient {

  public async searchVideo(name: string): Promise<string> {
    const result = await ytSearch(name);

    if (result.videos.length === 0) {
      console.log('Nenhum vídeo encontrado.');
      return null;
    }

    const video = result.videos[0];
    const videoId = video.url.replace('https://youtube.com/watch?v=', '');

    return videoId;
  }

}

export default new YoutubeHttpClient();
