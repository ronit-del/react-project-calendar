import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { PasswordDto } from './dto/password.dto';
import { User } from 'src/schema/user.schema';

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

    async register(registerDto: AuthDto, origin: string) {
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

            if (user) {
                const template = {
                    name: user.name,
                    email: user.email,
                    loginUrl: `${origin}/login`,
                }

                const html: string = await this.mailService.renderTemplate('signup', template);
                await this.mailService.sendEmail(email, 'Welcome to our platform', html);

                return {
                    message: 'User registered successfully',
                    status: 200,
                    user,
                };
            } else {
                throw new InternalServerErrorException('Error registering user');
            }
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error registering');
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userService.getUser(id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            return {
                message: 'User fetched successfully',
                status: 200,
                user,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error fetching users');
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

    async forgotPassword(email: string, origin: string) {
        try {
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const token = await this.jwtService.signAsync({ sub: user._id, username: email });
            const resetPasswordUrl = `${origin}/reset-password?token=${token}?email=${email}`;

            const template = {
                name: user.name,
                email: user.email,
                resetUrl: resetPasswordUrl,
            }

            const html: string = await this.mailService.renderTemplate('reset-password', template);
            await this.mailService.sendEmail(email, 'Password Reset', html);

            return {
                message: 'Password reset successfully',
                status: 200,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error resetting password');
        }
    }

    async resetPassword(passwordDto: PasswordDto) {
        try {
            const { email, oldPassword, newPassword } = passwordDto;

            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid old password');
            }

            if (oldPassword === newPassword) {
                throw new UnauthorizedException('New password cannot be the same as the old password');
            }

            const hashedNewPassword: string = await bcrypt.hash(newPassword, 10);

            await this.userService.updateUserPassword(user._id.toString(), hashedNewPassword);
            return {
                message: 'Password updated successfully',
                status: 200,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error updating password');
        }
    }

    async updateUserProfile(id: string, user: any) {
        try {
            const updatedUser = await this.userService.updateUser(id, user as User);
            if (!updatedUser) {
                throw new UnauthorizedException('User not found');
            }
            return {
                message: 'User profile updated successfully',
                status: 200,
                user: updatedUser,
            };
        } catch (error) {
            throw new InternalServerErrorException(error || 'Error updating user profile');
        }
    }
}
