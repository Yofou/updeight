import { Module } from '@nestjs/common';
import { ResponseModule } from '..//response/response.module';
import { OrganizationModule } from '../organization/organization.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [OrganizationModule, ResponseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
