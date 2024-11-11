import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.entity';
import { AlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';

@Injectable()
export class AlbumService {
  constructor(private eventEmitter: EventEmitter2) {}
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

    this.eventEmitter.emit('deleteEntity', new DeleteEntityEvent('album', id));

    this.albums.splice(idx, 1);
  }

  @OnEvent('deleteEntity')
  handleDeleteEvent(event: DeleteEntityEvent) {
    if (event.entityType === 'artist') {
      this.setNullArtist(event.entityId);
    }
  }

  setNullArtist(id: string) {
    const album = this.albums.find((el) => el.artistId === id);
    if (album) {
      this.update(album.id, { ...album, artistId: null });
    }
  }
}
