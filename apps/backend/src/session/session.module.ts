import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from './session.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}
