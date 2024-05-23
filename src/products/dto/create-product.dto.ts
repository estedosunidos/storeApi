import { Type } from "class-transformer"
import { IS_ALPHA, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateNested } from "class-validator"
import { CreateProductImageDto } from "./createProductImageDto.dto"

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title:string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number
    
    @IsString()
    @IsOptional()
    description:string

    @IsString()
    @IsOptional()
    slug?:string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number

    @IsString({each:true})
    @IsArray()
    size:string[]

    @IsIn(['men','women','kid'])
    gender:string
    
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags:string []

    @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images: CreateProductImageDto[];



}
