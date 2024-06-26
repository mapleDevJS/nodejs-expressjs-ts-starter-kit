import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
    public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
        if (!req.user) {
            return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware'));
        }
        next();
    }
}
