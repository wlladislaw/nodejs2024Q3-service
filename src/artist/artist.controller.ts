import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  findAllArtists() {
    return this.artistService.findAllArtists();
  }
  @Get(':id')
  findUnique(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistService.findOneArtist(id);
  }
  @Post()
  create(@Body() createArtistDto: ArtistDto) {
    return this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: ArtistDto,
  ) {
    return this.artistService.updateArtist(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    this.artistService.delete(id);
  }
}
