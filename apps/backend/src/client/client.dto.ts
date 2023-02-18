import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Client } from 'prisma';
import { OrganizationDTO } from '../organization/organization.dto';

export class ClientDto implements Client {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  thumbnail: string | null;
  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  organization: OrganizationDTO;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class CreateClientDto
  implements Pick<Client, 'name' | 'organizationId' | 'thumbnail'>
{
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsString()
  thumbnail: string;
}

export class UpdateClientDto implements Pick<Client, 'name' | 'thumbnail'> {
  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  thumbnail: string;
}
