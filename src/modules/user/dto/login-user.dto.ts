import { IsEmail, IsString } from 'class-validator';

export default class LoginUserDto {
    @IsEmail({}, { message: 'The email address provided is not valid. Please enter a valid email address.' })
    public email!: string;

    @IsString({ message: 'The password field cannot be empty. Please provide a valid password.' })
    public password!: string;
}
