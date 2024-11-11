import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { ArtistDto } from './dto/artist.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';
@Injectable()
export class ArtistService {
  constructor(private eventEmitter: EventEmitter2) {}
  private artists: Artist[] = [];

  findAllArtists(): Artist[] {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((el) => el.id === id);
    if (!artist) {
      throw new NotFoundException('Artist by this id not found');
    }
    return artist;
  }

  createArtist(createDto: ArtistDto) {
    const newArtist = {
      id: uuidv4(),
      name: createDto.name,
      grammy: createDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, updateDto: ArtistDto) {
    const artistIdx = this.artists.findIndex((el) => el.id === id);
    if (artistIdx === -1) {
      throw new NotFoundException('Not found artist by this id ');
    }
    const updatedArtist = { ...this.artists[artistIdx], ...updateDto };
    this.artists[artistIdx] = updatedArtist;
    return updatedArtist;
  }

  delete(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Not found artist by this id');
    }

    this.eventEmitter.emit('deleteEntity', new DeleteEntityEvent('artist', id));

    this.artists = this.artists.filter((el) => el.id !== id);
  }
}
