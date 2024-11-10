import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { AlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favsService: FavoritesService,
  ) {}
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Not found album by this id ');
    }
    return album;
  }

  create(albumDto: AlbumDto): Album {
    const newAlbum = { id: uuidv4(), ...albumDto };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, albumDto: AlbumDto): Album {
    const album = this.findOne(id);

    Object.assign(album, albumDto);
    return album;
  }

  delete(id: string): void {
    const idx = this.albums.findIndex((album) => album.id === id);
    if (idx === -1) {
      throw new NotFoundException('Not found album by this id ');
    }
    this.trackService.setNullAlbum(id);
    this.favsService.deleteFromFav(id, 'album');
    this.albums.splice(idx, 1);
  }
  setNullArtist(id: string) {
    const album = this.albums.find((el) => el.artistId === id);
    if (album) {
      this.update(album.id, { ...album, artistId: null });
    }
  }
}
