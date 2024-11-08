import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { ArtistDto } from './dto/artist.dto';
import { TrackService } from 'src/track/track.service';
@Injectable()
export class ArtistService {
  constructor(private readonly trackService: TrackService) {}
  private artists: Artist[] = [];

  findAllArtists(): Artist[] {
    return this.artists;
  }

  findOneArtist(id: string) {
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
    this.trackService.setNullArtist(id);
    this.artists = this.artists.filter((el) => el.id !== id);
  }
}
