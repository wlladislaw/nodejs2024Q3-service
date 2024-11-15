import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artist.entity';
import { ArtistDto } from './dto/artist.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ArtistService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  async findAllArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      return artist;
    } else {
      return null;
    }
  }

  async createArtist(createDto: ArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: {
        name: createDto.name,
        grammy: createDto.grammy,
      },
    });
    return newArtist;
  }

  async updateArtist(id: string, updateDto: ArtistDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Not found artist by this id ');
    }
    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        ...updateDto,
      },
    });

    return updatedArtist;
  }

  async delete(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      await this.prisma.artist.delete({
        where: { id },
      });
      this.eventEmitter.emit(
        'deleteEntity',
        new DeleteEntityEvent('artist', id),
      );
    } else {
      throw new NotFoundException('Not found artist by this id');
    }
  }
}
