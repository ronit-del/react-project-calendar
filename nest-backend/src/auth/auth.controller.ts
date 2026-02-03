import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';
import { Request } from 'express';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('/register')
    async register(@Body() registerDto: AuthDto, @Headers('origin') origin: string) {
        return this.authService.register(registerDto, origin);
    }

    @Get('/getUser')
    getUser(@Req() req: Request & { user: any }) {
        return this.authService.getUserById(req['user']?.sub as string);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() data: { email: string }, @Headers('origin') origin: string) {
        return this.authService.forgotPassword(data.email, origin);
    }

    @Post('/reset-password')
    resetPassword(@Body() passwordDto: PasswordDto) {
        return this.authService.resetPassword(passwordDto);
    }
}