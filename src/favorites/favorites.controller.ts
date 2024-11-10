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
  createFav(
    @Param('entity') entity: 'track' | 'album' | 'artist',

    @Param('id') id: string,
  ) {
    return this.favoritesService.addToFav(id, entity);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  removeFavorite(
    @Param('entity') entity: 'artist' | 'album' | 'track',
    @Param('id') id: string,
  ) {
    this.favoritesService.deleteFromFav(id, entity);
  }
}
