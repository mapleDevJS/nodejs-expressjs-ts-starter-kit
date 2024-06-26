import { prop, getModelForClass, modelOptions, defaultClasses } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

import { User } from '../../types/user.type.js';
import { hashPassword } from '../../utils/common.js';

const EMAIL_PATTERN = /^([\w-.]+@([\w-]+\.)+[\w-]{2,})?$/;
const PASSWORD_SPACES_PATTERN = /^\S*$/;
const AVATAR_PATTERN = /^(?:.*\.(?=(jpg|jpeg|png)$))?[^.]*$/i;

@modelOptions({
    schemaOptions: { collection: 'users' },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
    constructor(data: User) {
        super();
        this.email = data.email;
        this.avatarPath = data.avatarPath;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
    }

    @prop({
        required: true,
        default: '',
        unique: true,
        match: [EMAIL_PATTERN, 'Email is incorrect'],
    })
    public email!: string;

    @prop({
        required: true,
        match: [PASSWORD_SPACES_PATTERN, 'Spaces in the password are not allowed'],
        minlength: [60, 'Min length for the hashed password is 60 symbols'],
        maxlength: [60, 'Max length for the hashed password is 60 symbols'],
    })
    public password!: string;

    @prop({
        match: [AVATAR_PATTERN, 'Only jpg or png format is allowed'],
    })
    public avatarPath: string;

    @prop({ required: true, default: '' })
    public firstName!: string;

    @prop({ required: true, default: '' })
    public lastName!: string;

    // Method to set password with bcrypt
    public async setPassword(password: string): Promise<void> {
        this.password = await hashPassword(password);
    }

    // Method to get password
    public getPassword(): string {
        return this.password;
    }

    // Method to verify password
    public async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export const UserModel = getModelForClass(UserEntity);
