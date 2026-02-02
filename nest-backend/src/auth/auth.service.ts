import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly mailService: MailService
    ) { }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }

            const payload = { sub: user._id, username: email };
            const token = await this.jwtService.signAsync(payload);

            await this.mailService.sendEmail(email, 'Login successful', 'Login successful');

            return {
                message: 'Login successful',
                status: 200,
                user: user,
                token: token,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error logging in');
        }
    }

    async register(registerDto: AuthDto) {
        try {
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
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error registering');
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return {
                message: 'Users fetched successfully',
                status: 200,
                users,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error fetching users');
        }
    }
}
