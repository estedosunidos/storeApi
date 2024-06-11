import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common'
export const RowHeader= createParamDecorator(
    (data,ctx:ExecutionContext)=>{
        const req= ctx.switchToHttp().getRequest()
        return req.rawHeaders
       
    }

)


