import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getAllFavs() {
    const favorites = await this.getOrCreateFavs();
    const artists = await this.prisma.artist.findMany({
      where: { id: { in: favorites.artists } },
    });

    const albums = await this.prisma.album.findMany({
      where: { id: { in: favorites.albums } },
    });

    const tracks = await this.prisma.track.findMany({
      where: { id: { in: favorites.tracks } },
    });

    return { artists, albums, tracks };
  }

  async addToFav(id: string, entity: string) {
    const currEntity = this.getCurrService(entity);
    if (currEntity === null) {
      throw new BadRequestException('Not found entity');
    }
    try {
      const isFinded = await this.prisma[entity].findUnique({
        where: { id },
      });
      if (!isFinded) {
        throw new UnprocessableEntityException(`${entity} id does not exist`);
      }
    } catch (error) {
      throw error;
    }
    const favorites = await this.getOrCreateFavs();

    if (!favorites) {
      throw new NotFoundException(`Favorites not found`);
    }

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        [currEntity]: {
          push: id,
        },
      },
    });
  }

  async deleteFromFav(id: string, entity: string) {
    const currEntity = this.getCurrService(entity);
    if (!currEntity) {
      throw new BadRequestException(`Invalid entity type: ${entity}`);
    }
    const favorites = await this.getOrCreateFavs();

    if (!favorites[currEntity].includes(id)) {
      throw new NotFoundException(
        `${entity} with ID ${id} is not in favorites`,
      );
    }

    const updatedList = favorites[currEntity].filter((i) => i !== id);

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        [currEntity]: updatedList,
      },
    });
  }

  private async getOrCreateFavs() {
    let favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    return favorites;
  }
  private getCurrService(entity: string) {
    switch (entity) {
      case 'artist':
        return 'artists';
      case 'album':
        return 'albums';
      case 'track':
        return 'tracks';
      default:
        null;
    }
  }

  // @OnEvent('deleteEntity')
  // handleDeleteEvent(event: DeleteEntityEvent) {
  //   try {
  //     this.deleteFromFav(
  //       event.entityId,
  //       event.entityType as 'artist' | 'album' | 'track',
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }
}
