import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';

@Injectable()
export class TrackService {
  constructor(private eventEmitter: EventEmitter2) {}
  private tracks: Track[] = [];

  findAllTracks(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
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

    this.eventEmitter.emit('deleteEntity', new DeleteEntityEvent('track', id));

    this.tracks.splice(trackIdx, 1);
  }

  @OnEvent('deleteEntity')
  handleDelEvent(event: DeleteEntityEvent) {
    if (event.entityType === 'artist') {
      this.setNullArtist(event.entityId);
    } else if (event.entityType === 'album') {
      this.setNullAlbum(event.entityId);
    }
  }
  setNullArtist(artistId: string) {
    const track = this.tracks.find((el) => el.artistId === artistId);
    if (track) {
      this.update(track.id, { ...track, artistId: null });
    }
  }

  setNullAlbum(albumId: string) {
    const track = this.tracks.find((el) => el.albumId === albumId);
    if (track) {
      this.update(track.id, { ...track, albumId: null });
    }
  }
}
