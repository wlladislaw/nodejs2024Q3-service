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
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAllArtists() {
    return await this.artistService.findAllArtists();
  }
  @Get(':id')
  async findUnique(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist by this id not found');
    } else {
      return artist;
    }
  }
  @Post()
  async create(@Body() createArtistDto: ArtistDto) {
    return await this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: ArtistDto,
  ) {
    return await this.artistService.updateArtist(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.artistService.delete(id);
  }
}
