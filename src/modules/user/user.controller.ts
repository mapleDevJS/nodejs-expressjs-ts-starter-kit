import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { createJWT, fillDTO } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import { JWT_ALGORITHM } from './user.constant.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';

@injectable()
export default class UserController extends Controller {
    constructor(
        @inject(Component.LoggerInterface) logger: LoggerInterface,
        @inject(Component.ConfigInterface) configService: ConfigInterface,
        @inject(Component.UserServiceInterface)
        private readonly userService: UserServiceInterface,
    ) {
        super(logger, configService);
        this.logger.info('Register routes for UserController...');
        this.addRoute({
            path: '/register',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
        });
        this.addRoute({
            path: '/login',
            method: HttpMethod.Post,
            handler: this.login,
            middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
        });
        this.addRoute({
            path: '/:userId/avatar',
            method: HttpMethod.Post,
            handler: this.uploadAvatar,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateObjectIdMiddleware('userId'),
                new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
            ],
        });
        this.addRoute({
            path: '/login',
            method: HttpMethod.Get,
            handler: this.checkAuthenticate,
        });
    }

    // Create a new user.
    public async create(
        { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
        res: Response,
    ): Promise<void> {
        console.log(body);
        const existsUser = await this.userService.findByEmail(body.email);
        if (existsUser) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                `User with email «${body.email}» exists.`,
                'UserController',
            );
        }
        const result = await this.userService.create(body);
        console.log(result);
        this.send(res, StatusCodes.CREATED, fillDTO(UserResponse, result));
    }

    // Login to the private part of the application.
    public async login(
        { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
        res: Response,
    ): Promise<void> {
        const user = await this.userService.verifyUser(body);
        if (!user) {
            throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
        }
        const token = await createJWT(JWT_ALGORITHM, this.configService.get('JWT_SECRET'), {
            email: user.email,
            id: user.id,
        });
        this.ok(res, {
            ...fillDTO(LoggedUserResponse, user),
            token,
        });
    }

    public async uploadAvatar(req: Request, res: Response) {
        const { userId } = req.params;
        const uploadFile = { avatarPath: req.file?.filename };
        await this.userService.updateById(userId, uploadFile);
        this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
    }

    // Check the state of the user.
    public async checkAuthenticate(req: Request, res: Response) {
        if (!req.user) {
            throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
        }
        const user = await this.userService.findByEmail(req.user.email);
        this.ok(res, fillDTO(LoggedUserResponse, user));
    }
}
