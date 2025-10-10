import path from 'path';
import axios from 'axios';
import ytSearch from 'yt-search';
import { createSpinner } from 'nanospinner';
import { spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';

import { extractTracksData, sanitizeFileName } from '../helpers/playlist.helper';

import SpotifyHttpClient from '../http-clients/spotify.http-client';
import { withTimeout } from '../helpers/timeout.helper';

class PlaylistRoutine {
  private readonly timeout = 10_000_000;

  private async searchVideo(name: string): Promise<string> {
    const result = await ytSearch(name);

    if (result.videos.length === 0) {
      console.log('Nenhum vídeo encontrado.');
      return null;
    }

    const video = result.videos[0];
    const videoId = video.url.replace('https://youtube.com/watch?v=', '');

    return videoId;
  }

  private async executeCommand(module: string, args: string[], debug = false): Promise<void> {    
    const command = new Promise<string>((resolve, reject) => {
      try {
        const process = spawn(module, args);

        if (debug) {
          process.stdout.on('data', (data) => console.log(data.toString()))
          process.stderr.on('data', (data) => console.error(data.toString()))
        }

        process.on('close', (code) => {
          if (code === 0) return resolve(module);
          reject();
        });
      } catch (error) {
        reject()
      }
    })

    await withTimeout<string>(command, this.timeout, () => {
      console.warn('Timeout atingindo, cancelando download');
    });
  }

  private async downloadFile(videoId: string, filePath: string, fileName: string): Promise<boolean> {
    const downloadSpinner = createSpinner(`Fazendo download de ${fileName}...`)
    
    if (existsSync(filePath)) {
      console.log(`Música já existe no diretório, indo para a próxima`);
      downloadSpinner.error();
      return;
    }

    try {
      await this.executeCommand('yt-dlp', [
        '-x',
        '--audio-format',
        'mp3',
        '-o', 
        filePath, 
        videoId,
      ], true);

      downloadSpinner.success();

      return true;
    } catch {
      return false;
    }
  }


  private async downloadCover(url: string, filePath: string): Promise<void> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      writeFileSync(filePath, response.data);
    } catch (error) {
      throw new Error('Falha ao baixar imagem de música');
    }
  }

  private async defineMetadata(filePath: string, fileName: string, artist: string, album: string, title: string, coverPath: string): Promise<void> {
    const metadataSpinner = createSpinner(`Definindo metadados de ${fileName}`);
    if (!existsSync(filePath)) {
      console.log(`Música não encontrada no diretório, indo para a próxima`);
      metadataSpinner.error();
      return;
    }

    await this.executeCommand('eyeD3', [
      filePath,
      '--artist', artist,
      '--album', album,
      '--title', title,
      '--add-image', `${coverPath}:FRONT_COVER`,
    ]);
  }

  public async run(playlistId: string): Promise<void> {
    console.log(`Efetuando busca para a playlist ${playlistId}`);
    const playlist = await SpotifyHttpClient.fetchAllPlaylistTracks(playlistId);
    const tracks = await extractTracksData(playlist);

    for (const track of tracks) {
      const currentTrackName = track.name;
      const principalArtist = track.artists[0].name;

      const query = `${principalArtist} - ${currentTrackName}`
      const searchVideoSpinner = createSpinner(`Buscando ${query}...`)
      const videoId = await this.searchVideo(query);
      
      if (!videoId) {
        searchVideoSpinner.error();
        console.log(`Não foi possível encontrar o vídeo ${query}`);
        continue;
      }

      searchVideoSpinner.success();
      
      const downloadFolder = process.env.OUTPUT_PATH ?? 'downloads';
      const originalFile = sanitizeFileName(query);
      const fileName = `${originalFile}.mp3`;
      const filePath = path.join(__dirname, '..', '..', downloadFolder, fileName);
      const thumbPath = path.join(__dirname, '..', '..', downloadFolder, `${originalFile}.jpg`);

      const isDownloaded = await this.downloadFile(videoId, filePath, fileName);
      if (!isDownloaded) {
        console.log(`Não foi possível efetuar o download de ${query}, indo para o próximo...`)
        continue;
      }

      await this.downloadCover(track.coverUrl, thumbPath);
      await this.defineMetadata(filePath, fileName, track.artists[0].name, track.album.name, track.name, thumbPath);
    }

    console.log('Download de playlist concluído');
  }

}

export default new PlaylistRoutine();