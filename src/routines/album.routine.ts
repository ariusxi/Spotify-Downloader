import SpotifyHttpClient from "../http-clients/spotify.http-client";
import { SpotifyTrack } from "../http-clients/types/spotify.interface";
import { extractTracksAlbumData } from "../helpers/playlist.helper";

class AlbumRoutine {

  public async run(albumId: string): Promise<SpotifyTrack[]> {
    const albumTracks = await SpotifyHttpClient.fetchAllAlbumTracks(albumId);
    const albumData = await SpotifyHttpClient.fetchAlbumMetadata(albumId);
    
    const tracks = await extractTracksAlbumData(albumData, albumTracks);

    return tracks
  }

}

export default new AlbumRoutine();