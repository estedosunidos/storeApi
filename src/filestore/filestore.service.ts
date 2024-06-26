import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilestoreService {
    getStaticProductImage(imageName: string): string {
        const path = join(__dirname, '../static/products', imageName);

        if (!existsSync(path)) {
            throw new BadRequestException(`No product found with image ${imageName}`);
        }

        return path;
    }
}
