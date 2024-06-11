import { Module } from '@nestjs/common';
import { FilestoreService } from './filestore.service';

import { ConfigModule } from '@nestjs/config';
import { FilesController } from './filestore.controller';

@Module({
  controllers: [FilesController],
  providers: [FilestoreService],
  imports: [ConfigModule],
  exports:[ConfigModule]
})
export class FilestoreModule {}
