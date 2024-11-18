import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}
  private tracks: Track[] = [];

  async findAllTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    return await this.prisma.track.findUnique({
      where: { id },
    });
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = await this.prisma.track.create({
      data: {
        ...createTrackDto,
      },
    });
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Not found track by id - ${id}`);
    }

    const upTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
      },
    });
    return upTrack;
  }

  async delete(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (track) {
      await this.prisma.track.delete({
        where: { id },
      });
      this.eventEmitter.emit(
        'deleteEntity',
        new DeleteEntityEvent('track', id),
      );
    } else {
      throw new NotFoundException(`Not found track by id - ${id}`);
    }
  }

  //////
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
