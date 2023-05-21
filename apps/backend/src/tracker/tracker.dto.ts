import { IsISO8601, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Tracker } from 'prisma';

export class CreateTrackerDto
  implements Pick<Tracker, 'createdFor' | 'isToggledOn' | 'clientId'>
{
  @IsISO8601()
  createdFor: Date;

  @IsOptional()
  isToggledOn: boolean;

  @IsUUID()
  clientId: string;
}

export class UpdateTrackerDto
  implements Pick<Tracker, 'createdFor' | 'clientId' | 'beforeDuration'>
{
  @IsOptional()
  @IsISO8601()
  createdFor: Date;

  @IsOptional()
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsNumber()
  beforeDuration: number;
}
