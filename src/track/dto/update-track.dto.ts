import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(
  OmitType(CreateTrackDto, ['artistId', 'albumId'] as const),
) {
  artistId?: string | null;

  albumId?: string | null;
}
