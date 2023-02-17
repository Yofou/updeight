import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Organization } from 'prisma';

export class CreateOrganizationDTO implements Pick<Organization, 'name'> {
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'the name of the organization',
  })
  name: string;
}

export class OrganizationDTO implements Organization {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  invite_code: string;

  @ApiProperty({ type: 'string' })
  createdAt: Date;

  @ApiProperty({ type: 'string' })
  updated: Date;
}
