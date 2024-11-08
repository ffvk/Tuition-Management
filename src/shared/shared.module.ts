import { Module } from '@nestjs/common';
import { HelperService } from './helpers/helper/helper.service';

@Module({
  providers: [HelperService]
})
export class SharedModule {}
