import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { randomUUID } from 'crypto';
import { Member } from 'prisma';
import { Match } from '../decorator/match.decorator';

export class CreateMemberDto
  implements Pick<Member, 'name' | 'email' | 'password'>
{
  @ApiProperty({ example: 'johndoe2002' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'wklgxpoqcmaz1!5%' })
  @IsString()
  password: string;
}

export class UpdateMemberDto
  implements Partial<Pick<Member, 'name' | 'email' | 'password'>>
{
  @ApiProperty({ example: 'johndoe2002' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'wklgxpoqcmaz1!5%' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'wklgxpoqcmaz1!5%' })
  @ValidateIf((o) => o.password != undefined)
  @IsString()
  @Match('password')
  confirmPassword?: string;
}

export class LoginMemberDto implements Pick<Member, 'email' | 'password'> {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'wklgxpoqcmaz1!5%' })
  @IsString()
  password: string;
}

export class MemberResponseDto implements Omit<Member, 'password'> {
  @ApiProperty({ example: randomUUID() })
  id: string;

  @ApiProperty({ example: 'johndoe2002' })
  name: string;

  @ApiProperty({ example: 'johndoe@email.com' })
  email: string;

  @ApiProperty({
    type: 'string',
    example: '2002-06-12T21:48:33.597Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    example: '2022-08-24T21:48:33.597Z',
  })
  updatedAt: Date;
}
