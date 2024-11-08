import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAllTracks(): Track[] {
    return this.tracks;
  }

  findTrack(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Not found track by id - ${id}`);
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = { id: uuidv4(), ...createTrackDto };
    this.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIdx = this.tracks.findIndex((track) => track.id === id);
    if (trackIdx === -1) {
      throw new NotFoundException(`Not found track by id - ${id}`);
    }

    const upTrack = { ...this.tracks[trackIdx], ...updateTrackDto };
    this.tracks[trackIdx] = upTrack;
    return upTrack;
  }

  delete(id: string): void {
    const trackIdx = this.tracks.findIndex((track) => track.id === id);
    if (trackIdx === -1) {
      throw new NotFoundException(`Not found track by id - ${id}`);
    }

    this.tracks.splice(trackIdx, 1);
  }
}
