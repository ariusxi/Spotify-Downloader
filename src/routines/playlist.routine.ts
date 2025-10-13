import SpotifyHttpClient from '../http-clients/spotify.http-client';
import { extractTracksPlaylistData } from '../helpers/playlist.helper';
import { SpotifyTrack } from '../http-clients/types/spotify.interface';

class PlaylistRoutine {
  
  public async run(playlistId: string): Promise<SpotifyTrack[]> {
    const playlist = await SpotifyHttpClient.fetchAllPlaylistTracks(playlistId);
    const tracks = await extractTracksPlaylistData(playlist);

    return tracks
  }

}

export default new PlaylistRoutine();