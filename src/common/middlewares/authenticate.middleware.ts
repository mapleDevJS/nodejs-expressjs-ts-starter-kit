import { createSecretKey } from 'node:crypto';

import { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { StatusCodes } from 'http-status-codes';

import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class AuthenticateMiddleware implements MiddlewareInterface {
    private static readonly INVALID_TOKEN_MESSAGE = 'Invalid token';

    constructor(private readonly jwtSecret: string) {}

    public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
        const authorizationHeader = this.extractAuthorizationHeader(req);

        if (!authorizationHeader) {
            return next();
        }

        const [, token] = authorizationHeader;

        try {
            const { payload } = await jose.jwtVerify(
                token,
                createSecretKey(this.jwtSecret, 'utf-8')
            );

            this.setUserFromPayload(req, payload);
            return next();
        } catch {
            return next(
                new HttpError(StatusCodes.UNAUTHORIZED, AuthenticateMiddleware.INVALID_TOKEN_MESSAGE, 'AuthenticateMiddleware')
            );
        }
    }

    private extractAuthorizationHeader(req: Request): string[] | undefined {
        return req.headers?.authorization?.split(' ');
    }

    private setUserFromPayload(req: Request, payload: jose.JWTPayload): void {
        req.user = {
            email: payload.email as string,
            id: payload.id as string,
        };
    }
}
