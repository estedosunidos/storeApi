import { FilestoreModule } from './../filestore/filestore.module';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product ,ProductImage} from './entities';
import { AuthModule } from '../auth/auth.module';
import { SeedModule } from 'src/seed/seed.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[TypeOrmModule.forFeature([Product,ProductImage]),AuthModule],
  exports: [ProductsService,TypeOrmModule],
})
export class ProductsModule {}
