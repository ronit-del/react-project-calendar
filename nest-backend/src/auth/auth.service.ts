import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            message: 'Login successful',
            status: 200,
            user: user,
        };
    }

    async register(registerDto: AuthDto) {
        const { email, password } = registerDto;

        const existingUser = await this.userService.getUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        if (!password) {
            throw new UnauthorizedException('Password is required');
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
