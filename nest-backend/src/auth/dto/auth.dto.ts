import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
} from 'class-validator';
export class AuthDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;
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
        'Password must contain at least 6 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbole',
    },
  )
  password: string;
  @IsNotEmpty({ message: 'Role should not be empty' })
  role: string;
  @Matches(/^\+?[1-9][\d\s\-()]{7,}$/, {
    message: 'Phone number must be a valid phone number',
  })
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  phone: string;
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address should not be empty' })
  address: string;
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City should not be empty' })
  city: string;
  @IsString({ message: 'State must be a string' })
  @IsNotEmpty({ message: 'State should not be empty' })
  state: string;
  @IsString({ message: 'Zip must be a string' })
  @IsNotEmpty({ message: 'Zip should not be empty' })
  zip: string;
  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country should not be empty' })
  country: string;
}
