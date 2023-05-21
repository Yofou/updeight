import { Module } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { PrismaService } from '../prisma/prisma.service';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

@Module({
  imports: [],
  controllers: [TrackerController],
  providers: [TrackerService, PrismaService, SessionService],
})
export class TrackerModule {}
