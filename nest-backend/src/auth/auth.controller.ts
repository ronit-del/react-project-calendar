import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Controller('api')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            return {
                message: 'User not found',
                status: 400,
                user: null,
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                message: 'Invalid password',
                status: 400,
                user: null,
            };
        }

        return {
            message: 'Login successful',
            status: 200,
            user: user,
        };
    }

    @Post('/register')
    async register(@Body() registerDto: AuthDto) {
        const { email, password } = registerDto;

        const existingUser = await this.userService.getUserByEmail(email);
        if (existingUser) {
            return {
                message: 'User already exists',
                status: 400,
                user: null,
            };
        }

        if (!password) {
            return {
                message: 'Password is required',
                status: 400,
                user: null,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userService.createUser({
            ...registerDto,
            password: hashedPassword,
        });

        return {
            message: 'User registered successfully',
            status: 200,
            user,
        };
    }
}