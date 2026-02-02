import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('api/register')
export class AuthController {

    @Post()
    register(@Body() registerDto: AuthDto) {
        console.log('registerDto', registerDto)
        return {
            message: 'User registered successfully',
            status: 200,
            // data:,
        };
        // return this.authService.register(body);
    }
}
