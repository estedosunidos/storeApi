import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter } from './helper/fileFilter';
import { fileNamer } from './helper/fileName';
import { FilestoreService } from './filestore.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilestoreService,
    private readonly configService: ConfigService,
  ) {}

  @Get('products/:imageName')
  sendProductImage(@Param('imageName') imageName: string, @Res() res: Response) {
      try {
        //  const imagePath = this.filesService.getStaticProductImage(imageName);
        //  res.sendFile(imagePath, { root: '.' });
      } catch (error) {
          if (error instanceof BadRequestException) {
              res.status(400).send(error.message);
          } else {
            console.log('ss')
              res.status(500).send('Internal Server Error');
          }
      }
  }



  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,
  ){

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    // const secureUrl = `${ file.filename }`;
    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return { secureUrl };
  }

}