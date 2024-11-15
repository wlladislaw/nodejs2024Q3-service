import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.entity';
import { AlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DeleteEntityEvent } from 'src/events/deleteEntity.event';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}
  private albums: Album[] = [];

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      return album;
    } else {
      return null;
    }
  }

  async create(albumDto: AlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({
      data: {
        ...albumDto,
      },
    });

    return newAlbum;
  }

  async update(id: string, albumDto: AlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Not found album by this id ');
    }
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...albumDto,
      },
    });

    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      await this.prisma.album.delete({
        where: { id },
      });
      this.eventEmitter.emit(
        'deleteEntity',
        new DeleteEntityEvent('album', id),
      );
    } else {
      throw new NotFoundException('Not found album by this id ');
    }
  }

  @OnEvent('deleteEntity')
  handleDeleteEvent(event: DeleteEntityEvent) {
    if (event.entityType === 'artist') {
      this.setNullArtist(event.entityId);
    }
  }

  async setNullArtist(id: string) {
    //   const album = this.albums.find((el) => el.artistId === id);
    //   if (album) {
    //     this.update(album.id, { ...album, artistId: null });
    //   }
    //   await this.prisma.album.update({
    //     where: { artistId: id },
    //     data: { artistId: null },
    //   });
    // }
  }
}
