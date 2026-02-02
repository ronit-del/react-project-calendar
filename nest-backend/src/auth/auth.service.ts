import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async register(user: AuthDto) {
        const existingUser = await this.userService.getUserByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const newUser = await this.userService.createUser(user);

        return {
            message: 'User registered successfully',
            status: 200,
            data: newUser,
        };
    }
}
