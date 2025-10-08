import path from 'path';
import { createSpinner } from 'nanospinner';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

import { extractTracksData } from '../helpers/playlist.helper';

import SpotifyHttpClient from '../http-clients/spotify.http-client';
import YoutubeHttpClient from '../http-clients/youtube.http-client';
import { withTimeout } from '../helpers/timeout.helper';


class PlaylistRoutine {
  private readonly timeout = 3000;

  private async downloadFile(videoUrl: string, filePath: string): Promise<string> {
    if (existsSync(filePath)) {
      console.log(`Música já existe no diretório, indo para a próxima`);
      return;
    }

    const command = new Promise<string>((resolve, reject) => {
      try {
        const process = spawn('yt-dlp', ['-x', '--audio-format', 'mp3', '-o', filePath, videoUrl]);

        process.stdout.on('data', (data) => console.log(data.toString()))
        process.stderr.on('data', (data) => console.error(data.toString()))

        process.on('close', (code) => {
          if (code === 0) return resolve(filePath);
          return reject(false);
        });
      } catch {
        reject()
      }
    })

    try {
      const response = await withTimeout<string>(command, this.timeout, () => {
        console.warn('Timeout atingindo, cancelando download');
      });

      return response;
    } catch {
      return null;
    }
  }

  public async run(playlistId: string): Promise<void> {
    console.log(`Efetuando busca para a playlist ${playlistId}`);
    const playlist = await SpotifyHttpClient.fetchAllPlaylistTracks(playlistId);
    const tracks = extractTracksData(playlist);

    console.log(`${tracks.length} músicas encontradas`);

    for (const track of tracks) {
      const currentTrackName = track.name;
      const principalArtist = track.artists[0].name;

      const query = `${principalArtist} - ${currentTrackName}`

      const searchVideoSpinner = createSpinner(`Buscando ${query}...`)
      const videoId = await YoutubeHttpClient.searchVideo(currentTrackName);
      if (!videoId) {
        searchVideoSpinner.error();
        console.log(`Não foi possível encontrar o vídeo ${query}`);
        return;
      }

      searchVideoSpinner.success();
      
      const downloadFolder = process.env.OUTPUT_PATH ?? 'downloads';
      const fileName = `${query}.mp3`
      const filePath = path.join(__dirname, '..', '..', downloadFolder, fileName);

      console.log(`https://www.youtube.com/watch?v=${videoId}`);

      await this.downloadFile(videoId, filePath);
    }
  }

}

export default new PlaylistRoutine();