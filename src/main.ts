import dotenv from 'dotenv';

dotenv.config();

import { extractPlaylistId } from './helpers/playlist.helper';
import PlaylistRoutine from './routines/playlist.routine';

const bootstrap = async (args: string[]) => {
  const argument = args.slice(2);
  const playlistUrl = argument[0];
  
  if (!playlistUrl) {
    return console.error('Você deve enviar uma URL Playlist');
  }

  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) {
    return console.error('Link de playlist inválido');
  }

  return await PlaylistRoutine.run(playlistId);
}
bootstrap(process.argv);