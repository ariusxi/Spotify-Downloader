import axios from 'axios';
import { createSpinner } from 'nanospinner';
import { existsSync, writeFileSync } from 'fs';

import { executeCommand } from '../helpers/command.helper';

class AudioService {

  public async downloadAudio(videoId: string, filePath: string, fileName: string): Promise<boolean> {
    const downloadSpinner = createSpinner(`Fazendo download de ${fileName}...`);

    if (existsSync(filePath)) {
      console.log(`Música já existe no diretório, indo para a próxima`);
      downloadSpinner.error();
      return;
    }

    try {
      await executeCommand('yt-dlp', [
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

  public async downloadCover(url: string, filePath: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      writeFileSync(filePath, response.data);

      return url;
    } catch (error) {
      return null;
    }
  }

  public async defineMetadata(filePath: string, fileName: string, artist: string, album: string, title: string, coverPath: string): Promise<void> {
    const metadataSpinner = createSpinner(`Definindo metadados de ${fileName}`);
    if (!existsSync(filePath)) {
      console.log(`Música não encontrada no diretório, indo para a próxima`);
      metadataSpinner.error();
      return;
    }

    await executeCommand('eyeD3', [
      filePath,
      '--artist', artist,
      '--album', album,
      '--title', title,
      '--add-image', `${coverPath}:FRONT_COVER`,
    ]);
  }

}

export default new AudioService();
