import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface UserServiceInterface {
    create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
    updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
    verifyUser(dto: LoginUserDto): Promise<DocumentType<UserEntity> | null>;
}
