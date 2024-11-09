import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [TrackModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
