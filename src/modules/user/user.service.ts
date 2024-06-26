import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import UpdateUserDto from './dto/update-user.dto.js';
import LoginUserDto from './dto/login-user.dto';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

@injectable()
export default class UserService implements UserServiceInterface {
    constructor(
        @inject(Component.LoggerInterface) private logger: LoggerInterface,
        @inject(Component.UserModel)
        private readonly userModel: types.ModelType<UserEntity>,
    ) {}

    public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
        const user = new UserEntity({
            ...dto,
            avatarPath: DEFAULT_AVATAR_FILE_NAME,
        });
        await user.setPassword(dto.password);

        const result = await this.userModel.create(user);
        this.logger.info(`New user created: ${user.email}`);

        return result;
    }

    public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({ email });
    }

    public async findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
        const existedUser = await this.findByEmail(dto.email);

        if (existedUser) {
            return existedUser;
        }

        return this.create(dto);
    }

    public async updateById(
        userId: string,
        dto: UpdateUserDto,
    ): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
    }

    public async verifyUser(dto: LoginUserDto): Promise<DocumentType<UserEntity> | null> {
        const user = await this.findByEmail(dto.email);

        if (!user) {
            return null;
        }

        if (await user.verifyPassword(dto.password)) {
            return user;
        }

        return null;
    }
}
