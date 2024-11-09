import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.entity';
import { AlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}
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
    this.albums.splice(idx, 1);
  }
}
