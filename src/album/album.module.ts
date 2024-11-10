import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
