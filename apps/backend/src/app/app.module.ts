import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { ResponseModule } from '../response/response.module';
import { OrganizationModule } from '../organization/organization.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [OrganizationModule, ResponseModule, ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
