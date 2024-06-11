import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createuserdto } from './dtos/create=user.dto';
import { LoginUserDto } from './dtos/login-user-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/User.entity';
import { RowHeader } from './decorators/row-header.decoratos';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Roleprotected } from './decorators/roleprotected/roleprotected.decorator';
import { ValidRoles } from './interfaces/validRole.interface';
import { Auth } from './decorators/roleprotected/auth.decorate';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: createuserdto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginuserdto: LoginUserDto) {
    return this.authService.loginuser(loginuserdto);
  }
  @Get('check-auth-status')
  @Auth()
  chackAuthStatu(@GetUser() user:User){
    return this.authService.checkAuthStatus(user)
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') useremail: string,
    @RowHeader() rowHeader: string[],
  ) {
    // console.log({user:request.user})
    return {
      ok: true,
      message: 'Hello word privay',
      user,
      useremail,
      rowHeader,
    };
  }
  @Get('private2')
  // @SetMetadata('roles',['admin','user'])
  @Auth(ValidRoles.admin)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
  @Get('private3')
  // @SetMetadata('roles',['admin','user'])
  @Roleprotected(ValidRoles.superuser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
