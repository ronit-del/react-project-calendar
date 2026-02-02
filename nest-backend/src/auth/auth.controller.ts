import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('/register')
    async register(@Body() registerDto: AuthDto) {
        return this.authService.register(registerDto);
    }

    @Get('/getAllUsers')
    getAllUsers() {
        return this.authService.getAllUsers();
    }
}