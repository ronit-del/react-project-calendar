import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';

@Controller('api/register')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post()
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