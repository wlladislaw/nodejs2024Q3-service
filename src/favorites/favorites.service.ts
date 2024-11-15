import { ArtistService } from './../artist/artist.service';
import { AlbumService } from './../album/album.service';
import { TrackService } from './../track/track.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Favorites } from './favorites.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { tracks: [], albums: [], artists: [] };

  constructor(
    private readonly trackService: TrackService,

    private readonly albumService: AlbumService,

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

  async addToFav(id: string, entity: string) {
    const currService = this.getCurrService(entity);
    if (currService === null) {
      throw new BadRequestException('Not found');
    }
    try {
      await currService.service.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(`${entity} id does not exist`);
      } else {
        throw error;
      }
    }

    const favoritesList = this.favorites[currService.favsArr];
    if (!favoritesList.includes(id)) {
      favoritesList.push(id);
    }
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

  @OnEvent('deleteEntity')
  handleDeleteEvent(event: DeleteEntityEvent) {
    try {
      this.deleteFromFav(
        event.entityId,
        event.entityType as 'artist' | 'album' | 'track',
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  deleteFromFav(id: string, entity: string) {
    const currService = this.getCurrService(entity);

    const currArr = this.favorites[currService?.favsArr];

    const idx = currArr?.indexOf(id);

    if (idx === -1) {
      throw new NotFoundException(`${entity} by ${id} does not exist in favs`);
    }

    currArr?.splice(idx, 1);
  }
}
