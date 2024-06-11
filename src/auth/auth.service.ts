import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { createuserdto } from './dtos/create=user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';
import  * as bcrypt  from 'bcrypt'
import { LoginUserDto } from './dtos/login-user-dto';
import { JwtPayload } from './interfaces/jwt=payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepositorio:Repository<User>,
   private readonly jwtService:JwtService
){}
 async  create(createAuthDto: createuserdto) {
      try{
        const { password,...userDate} = createAuthDto
        const user= this.userRepositorio.create({
          ...userDate,
          password:bcrypt.hashSync(password,10)
        })
        await this.userRepositorio.save(user)
        delete user.password
        return {
          ...user,
          token:this.getjwttoke({id:user.id})
        }

      }catch(erro){
        this.handleEror(erro);

      }
  }
  async loginuser(loginuserdto:LoginUserDto){
    try{
      const { password,email}= loginuserdto
      const user = await this.userRepositorio.findOne({
        where:{email},
        select:{email:true,password:true}
      })
      if(!user)
        throw new UnauthorizedException('Credentials are not valid (email) ')
      if(bcrypt.compareSync(user.password,password))
        throw new UnauthorizedException('Credentials are not valid (password) ')
      return {
        ...user,
        token:this.getjwttoke({id:user.id})
      }

    }catch(error){
      this.handleEror(error);
    }

  }
  async checkAuthStatus(user:User){
    return {
      ...user,
      token:this.getjwttoke({id:user.id})
    }
  }
  private getjwttoke(payload:JwtPayload){
    const token=this.jwtService.sign(payload)
    return token


  }
  private handleEror(err:any){
    if(err.code === '23505')
      throw new BadRequestException(err.detail)
    throw new InternalServerErrorException('please check server log')
  }
 


}
