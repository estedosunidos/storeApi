
import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';


import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilestoreModule } from './filestore/filestore.module';

import { join } from 'path';
import { AuthModule } from './auth/auth.module';

import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ConfigModule.forRoot(),TypeOrmModule.forRoot({
    type:'postgres',
    host:process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities:true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),     ServeStaticModule.forRoot({
    rootPath: join(__dirname,'..','public'), 
  }),ProductsModule,CommonModule,FilestoreModule, AuthModule,SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
