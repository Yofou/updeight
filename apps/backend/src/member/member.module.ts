import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [MemberController],
  providers: [PrismaService, MemberService],
})
export class MemberModule {}
