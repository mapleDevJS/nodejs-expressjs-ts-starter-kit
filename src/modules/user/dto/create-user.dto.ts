import { IsEmail, IsString, Length } from 'class-validator';

export default class CreateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    public email!: string;

    @IsString({ message: 'First name is required.' })
    @Length(1, 15, { message: 'First name must be between 1 and 15 characters long.' })
    public firstName!: string;

    @IsString({ message: 'Last name is required.' })
    @Length(1, 15, { message: 'Last name must be between 1 and 15 characters long.' })
    public lastName!: string;

    @IsString({ message: 'Password is required.' })
    @Length(6, 12, { message: 'Password must be between 6 and 12 characters long.' })
    public password!: string;
}
