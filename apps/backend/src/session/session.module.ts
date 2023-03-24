import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from './session.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ResponseService } from '../response/response.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SessionService, PrismaService, ResponseService],
  exports: [SessionService],
})
export class SessionModule {}
