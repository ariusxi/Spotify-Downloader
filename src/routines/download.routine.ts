import path from 'path';
import { createSpinner } from 'nanospinner';

import { sanitizeFileName } from '../helpers/playlist.helper';
import { SpotifyTrack } from '../http-clients/types/spotify.interface';
import YoutubeHttpClient from '../http-clients/youtube.http-client';
import AudioService from '../services/audio.service';

class DownloadRoutine {

  private buildPaths(query: string): { fileName: string, filePath: string, thumbPath: string } {
    const downloadFolder = process.env.OUTPUT_PATH ?? 'downloads';
    const originalFile = sanitizeFileName(query);
    const fileName = `${originalFile}.mp3`;

    return {
      fileName,
      filePath: path.join(__dirname, '..', '..', downloadFolder, fileName),
      thumbPath: path.join(__dirname, '..', '..', downloadFolder, `${originalFile}.jpg`),
    };
  }

  public async run(tracks: SpotifyTrack[]): Promise<void> {
    for (const track of tracks) {
      const query = `${track.artists[0].name} - ${track.name}`;
      const searchVideoSpinner = createSpinner(`Buscando ${query}...`);
      const videoId = await YoutubeHttpClient.searchVideo(query);

      if (!videoId) {
        searchVideoSpinner.error();
        console.log(`Não foi possível encontrar o vídeo ${query}`);
        continue;
      }

      searchVideoSpinner.success();

      const { fileName, filePath, thumbPath } = this.buildPaths(query);

      const isSongDownloaded = await AudioService.downloadAudio(videoId, filePath, fileName);
      if (!isSongDownloaded) {
        console.log(`Não foi possível efetuar o download de ${query}, indo para o próximo...`);
        continue;
      }

      const isCoverDownloaded = await AudioService.downloadCover(track.coverUrl, thumbPath);
      if (!isCoverDownloaded) {
        console.log(`Não foi possível efetuar o download da cover de ${query}, indo para o próximo...`);
        continue;
      }

      await AudioService.defineMetadata(filePath, fileName, track.artists[0].name, track.album.name, track.name, thumbPath);
    }

    console.log('Download de playlist concluído');
  }

}

export default new DownloadRoutine();
