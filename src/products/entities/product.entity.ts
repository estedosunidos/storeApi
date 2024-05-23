import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-Imagen.entidi";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text',{
        unique: true,
    })
    title:string

    @Column('float',{
        default:0
    })
    price:number
    @Column({
        type:'text',
        nullable:true
    })
    description: string
    @Column('text',{
        unique:true
    })
    slug: string
    @Column('int',{
        default: 0
    })
    stock :number
    @Column('text',{
        array:true
    })
    size:string[]
    @Column('text')
    gender:string
    

    //tags
    @Column('text',{
       array: true,
       default: []
    })
    tags:string[]

    //images
    @OneToMany(
    ()=> ProductImage,
    (ProductImage)=>ProductImage.product,
    {cascade: true,eager: true}

    )
    images?:ProductImage[]

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


}
