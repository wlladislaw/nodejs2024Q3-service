import { IsNotEmpty } from 'class-validator';

import { IsString, IsUUID, IsInt, IsOptional } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;
}
