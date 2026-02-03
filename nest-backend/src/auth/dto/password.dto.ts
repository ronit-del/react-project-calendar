import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
export class PasswordDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;
    @IsNotEmpty({ message: 'Old password should not be empty' })
    oldPassword: string;
    @IsNotEmpty({ message: 'New password should not be empty' })
    @IsStrongPassword(
        {
            minLength: 6,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
            minLowercase: 1,
        },
        {
            message:
                'New password must contain at least 6 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbole',
        },
    )
    newPassword: string;
}