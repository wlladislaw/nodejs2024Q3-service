import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavs() {
    return this.favoritesService.getAllFavs();
  }

  @Post(':entity/:id')
  async createFav(
    @Param('entity') entity: 'track' | 'album' | 'artist',

    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.favoritesService.addToFav(id, entity);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  deleteFav(
    @Param('entity') entity: 'artist' | 'album' | 'track',
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    this.favoritesService.deleteFromFav(id, entity);
  }
}
