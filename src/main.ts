import dotenv from 'dotenv';

dotenv.config();

import { extractSpotifyId } from './helpers/playlist.helper';

import AlbumRoutine from './routines/album.routine';
import DownloadRoutine from './routines/download.routine';
import PlaylistRoutine from './routines/playlist.routine';

const bootstrap = async (args: string[]) => {
  const argument = args.slice(2);
  const listUrl = argument[0];
  
  if (!listUrl) {
    return console.error('Você deve enviar uma URL Playlist');
  }

  const metadata = extractSpotifyId(listUrl);
  if (!metadata) {
    return console.error('Link de playlist inválido');
  }

  const { actionId, actionType } = metadata;
  const actions = {
    'playlist': PlaylistRoutine.run,
    'album': AlbumRoutine.run,
  }

  const tracks = await actions[actionType](actionId)

  await DownloadRoutine.run(tracks);
}
bootstrap(process.argv);