import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAllAlbums() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  async findOneAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new NotFoundException('Not found album by this id ');
    } else {
      return album;
    }
  }

  @Post()
  async create(@Body() albumDto: AlbumDto) {
    return await this.albumService.create(albumDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() albumDto: AlbumDto,
  ) {
    return await this.albumService.update(id, albumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.albumService.delete(id);
  }
}
