import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from '../client/client.module';
import { ResponseModule } from '../response/response.module';
import { OrganizationModule } from '../organization/organization.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from '../member/member.module';
import { TrackerModule } from '../tracker/tracker.module';

@Module({
  imports: [
    OrganizationModule,
    ResponseModule,
    ClientModule,
    MemberModule,
    TrackerModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
