import { BadRequestException, Injectable, InternalServerErrorException, Logger, Delete, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {DataSource ,DeepPartial,Repository } from 'typeorm';
import {validate as isUUID} from 'uuid'
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepositori:Repository<ProductImage>,
    private readonly  DataSource:DataSource
  ){}
  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto)
    try{
      const product=this.productRepository.create(createProductDto)
      await this.productRepository.save(product)
      return product

    }catch(err){
      this.handleException(err);
    } 
  }
  async findAll(PaginationDTO:PaginationDTO) {
    const { limit=10,offset=0} = PaginationDTO
    const products  =await this.productRepository.find({
      take:limit,
      skip:offset,
      relations:{
        images:true

      }

    })
    return products.map(product=>({
      ...product,
      images: product.images.map(image=>image.url)

    }))
  }
 async  findOne(term: string) {
  let Product:Product
  if(isUUID(term)){
    Product = await this.productRepository.findOneBy({id:term})
  }else{
    const queryBuilder = this.productRepository.createQueryBuilder('prod')
    Product= await queryBuilder.where('LOWER(product.title) = LOWER(:term) OR LOWER(product.slug) = LOWER(:term)', {
      term,
    }).leftJoinAndSelect('prod.imagenes','prodImages').getOne()
    //Product = await this.productRepository.findOneBy({slug:term})
  }

    //const product = await this.productRepository.findOneBy({id})
    if(!Product){
      throw new NotFoundException( `Product with id ${term} not found ` )
    }
    return  Product 
  }
  async finOneplain(term:string){
    const {images=[], ...res} = await this.findOne(term)
    return {
      ...res,
      images1:images.map(imagenes=>imagenes.url)
    }
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const queryRunner = this.DataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const product = await this.productRepository.preload({ id, ...toUpdate });
        if (!product) {
            throw new BadRequestException(`Product with id ${id} not found`);
        }

        if (images) {
            await queryRunner.manager.delete(ProductImage, { product: { id } });
            product.images = images.map(image => this.productImageRepositori.create({ url: image.url } as DeepPartial<ProductImage>));

        }else{
          
        }

        const updatedProduct = await queryRunner.manager.save(product);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return updatedProduct;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleException(error);
    }
}

  async remove(id: string ) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
  }
  private handleException(error:any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)    
    throw new InternalServerErrorException('Unexpected error, check server logs ')
  }
}
