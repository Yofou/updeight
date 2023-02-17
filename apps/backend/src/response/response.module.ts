import { Global, Module } from '@nestjs/common';
import { ResponseService } from './response.service';

const providers = [ResponseService];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers,
  exports: providers,
})
export class ResponseModule {}
