
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-Imagen.entidi";
import { User } from "src/auth/entities/User.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {
    @ApiProperty({
        example:'fb1a4692-40c7-45c1-9e9d-30dff9605faf',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string
    @ApiProperty({
        example:'Men’s Chill Crew Neck Sweatshirt692-40c7-45c1-9e9d-30dff9605faf',
        description:'Product title',
        uniqueItems:true
    })
    @Column('text',{
        unique: true,
    })
    title:string
    @ApiProperty({
        example:0,
        description:'Product price'
    })
    @Column('float',{
        default:0
    })
    price:number
    @ApiProperty({
        example:'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
        description:'Product description'
    })
    @Column({
        type:'text',
        nullable:true
    })
    description: string
    @ApiProperty({
        example:'mens_chill_crew_neck_sweatshirt',
        description:'Product slug'
    })
    @Column('text',{
        unique:true
    })
    slug: string
    @ApiProperty({
        example:8,
        description:'Product stock'
    })
    @Column('int',{
        default: 0
    })
    stock :number
    @ApiProperty({
        example:['XS','S','M','L','XL','XXL'],
        description:'Product sizes'
    })
    @Column('text',{
        array:true
    })
    sizes:string[]
    @ApiProperty({
        example:['men','women','kid','unisex'],
        description:'Product gender'
    })
    @Column('text')
    gender:string
    

    //tags
    @ApiProperty({
        example:['sweatshirt'],
        description:'Product tags'
    })
    @Column('text',{
       array: true,
       default: []
    })
    tags:string[]

    //images
    @ApiProperty({
        example: [
            '1740176-00-A_0_2000.jpg',
            '1740176-00-A_1.jpg',
        ],
        description:'Product images'
    })
    @OneToMany(
     ()=> ProductImage,
     (ProductImage)=>ProductImage.product,
     {cascade: true,eager: true}

     )
    images:ProductImage[]

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title.toLowerCase().replaceAll('','_').replaceAll("'",'')
          }else{
            this.slug = this.slug.toLowerCase().replaceAll('','_').replaceAll("'",'')
          }
    }
    @BeforeUpdate()
    checkSlugUpdate(){
        if(!this.slug){
            this.slug = this.title.toLowerCase().replaceAll('','_').replaceAll("'",'')
          }else{
            this.slug = this.slug.toLowerCase().replaceAll('','_').replaceAll("'",'')
          }
    }
     @ManyToOne(
    ()=> User,
         (user)=> user.product,
         {eager:true}
     )
     user:User


}
