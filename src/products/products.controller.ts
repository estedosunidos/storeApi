import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/roleprotected/auth.decorate';
import { ValidRoles } from 'src/auth/interfaces/validRole.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/User.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status:201,description:'Product was created',type:Product})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden,Token Relative'})
  //@Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto,@GetUser() user:User) {
    console.log(createProductDto	)
    return this.productsService.create(createProductDto,user);
  }

  @Get()
  findAll(@Query() PaginationDTO:PaginationDTO) {
    return this.productsService.findAll(PaginationDTO);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,@GetUser() user:User) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
