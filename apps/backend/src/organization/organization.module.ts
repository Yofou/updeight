import { Module } from '@nestjs/common';
import { ResponseService } from '../response/response.service';
import { SessionService } from '../session/session.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    PrismaService,
    ResponseService,
    SessionService,
  ],
})
export class OrganizationModule {}
