import { ArtistService } from './../artist/artist.service';
import { AlbumService } from './../album/album.service';
import { TrackService } from './../track/track.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Favorites } from './favorites.entity';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { tracks: [], albums: [], artists: [] };

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  getAllFavs() {
    const res = {
      tracks: this.favorites.tracks.map((id) => this.trackService.findOne(id)),
      albums: this.favorites.albums.map((id) => this.albumService.findOne(id)),
      artists: this.favorites.artists.map((id) =>
        this.artistService.findOne(id),
      ),
    };

    return res;
  }

  addToFav(id: string, entity: string) {
    const currService = this.getCurrService(entity);
    if (currService === null) {
      throw new BadRequestException('Not found');
    }
    const currEntity = currService.service.findOne(id);
    if (!currEntity) {
      throw new UnprocessableEntityException(`${entity} does not exist`);
    }

    const favoritesList = this.favorites[currService.favsArr];
    if (!favoritesList.includes(id)) favoritesList.push(id);
  }

  private getCurrService(entity: string) {
    switch (entity) {
      case 'artist':
        return { service: this.artistService, favsArr: 'artists' };
      case 'album':
        return { service: this.albumService, favsArr: 'albums' };
      case 'track':
        return { service: this.trackService, favsArr: 'tracks' };
      default:
        null;
    }
  }

  deleteFromFav(id: string, entity: string) {
    const currService = this.getCurrService(entity);
    const currArr = this.favorites[currService.favsArr];
    const idx = currArr.indexOf(id);

    if (idx === -1) {
      throw new BadRequestException('Not found');
    }

    currArr.splice(idx, 1);
  }
}
