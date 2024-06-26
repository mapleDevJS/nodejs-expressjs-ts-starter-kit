import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/route.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { ConfigInterface } from '../config/config.interface.js';
import { getFullServerPath, transformObject } from '../../utils/common.js';
import { UnknownObject } from '../../types/unknown-object.type.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/application.constant.js';

@injectable()
export abstract class Controller implements ControllerInterface {
    private readonly _router: Router;

    constructor(
        protected readonly logger: LoggerInterface,
        protected readonly configService: ConfigInterface,
    ) {
        this._router = Router();
        this.logger.info('Controller initialized', { controller: this.constructor.name });
    }

    get router() {
        return this._router;
    }

    public addRoute(route: RouteInterface) {
        const routeHandler = asyncHandler(route.handler.bind(this));
        const middlewares = route.middlewares?.map((middleware) =>
            asyncHandler(middleware.execute.bind(middleware)),
        );
        const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
        this._router[route.method](route.path, allHandlers);
        this.logger.info(`Route registered successfully`, {
            method: route.method.toUpperCase(),
            path: route.path,
            middlewares: route.middlewares ? route.middlewares.map(m => m.constructor.name) : [],
        });
    }

    protected addStaticPath(data: UnknownObject): void {
        const fullServerPath = getFullServerPath(
            this.configService.get('HOST'),
            this.configService.get('PORT'),
        );
        transformObject(
            STATIC_RESOURCE_FIELDS,
            `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
            `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
            data,
        );
        this.logger.debug('Static paths added to data', { data });
    }

    public send<T>(res: Response, statusCode: number, data: T): void {
        this.addStaticPath(data as UnknownObject);
        res.type('application/json').status(statusCode).json(data);
        this.logger.info('Response sent', { statusCode, responseData: data, controller: this.constructor.name });
    }

    public created<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.CREATED, data);
        this.logger.info('Created response sent', { statusCode: StatusCodes.CREATED, responseData: data, controller: this.constructor.name });
    }

    public noContent<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.NO_CONTENT, data);
        this.logger.info('No content response sent', { statusCode: StatusCodes.NO_CONTENT, responseData: data, controller: this.constructor.name });
    }

    public ok<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.OK, data);
        this.logger.info('OK response sent', { statusCode: StatusCodes.OK, responseData: data, controller: this.constructor.name });
    }
}
