import { Product } from './../../products/entities/product.entity';
import { IsArray, IsBoolean, IsSemVer, IsString } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text',{
        unique: true
    })
    @IsString()
    email:string
   
    
    @IsString()
    @Column('text',{
        select: false
    })
    password:string

    @IsString()
    @Column('text')
    fullName:string

    @IsBoolean()
     @Column('bool',{
        default:true
     })
    isActive:boolean

    @IsArray()
    @Column('text',{
        array:true,
        default:['úser']
    })
    roles:string[]
  @BeforeInsert()
  checckfielbeforeinsert(){
    this.email=this.email.toLowerCase().trim()
  }
  @BeforeUpdate()
  checckfielbeforeupdate(){
    this.email=this.email.toLowerCase().trim()
  }
  @OneToMany(
     ()=>Product,
     (product) => product.user
   )
  product:Product

}
