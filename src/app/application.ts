import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import expressRateLimit from 'express-rate-limit';
import cors from 'cors';

import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenticate.middleware.js';
import { getFullServerPath } from '../utils/common.js';

@injectable()
export default class Application {
    private expressApp: Express;

    constructor(
        @inject(Component.LoggerInterface) private logger: LoggerInterface,
        @inject(Component.ConfigInterface) private config: ConfigInterface,
        @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
        @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
        @inject(Component.UserController) private userController: ControllerInterface,
        // Inject your controllers here
    ) {
        this.expressApp = express();
    }

    public initRoutes() {
        this.expressApp.use('/users', this.userController.router);
        // Add your routes here
        this.logger.info('Routes have been initialized.');
    }

    public initMiddleware() {
        this.expressApp.use(express.json());
        this.expressApp.use(
            expressRateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                limit: 100, // max 100 requests per windowMs
                message: 'Too many requests from this IP, please try again after 15 minutes',
            }),
        );
        this.logger.info('Rate limiting middleware initialized with a window of 15 minutes and a maximum of 100 requests.');

        this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
        this.logger.info(`Static files middleware initialized at "/upload" with directory: ${this.config.get('UPLOAD_DIRECTORY')}`);

        this.expressApp.use('/static', express.static(this.config.get('STATIC_DIRECTORY_PATH')));
        this.logger.info(`Static files middleware initialized at "/static" with directory: ${this.config.get('STATIC_DIRECTORY_PATH')}`);

        const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
        this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
        this.logger.info('Authentication middleware has been initialized.');

        this.expressApp.use(cors());
        this.logger.info('CORS middleware initialized.');
    }

    public initExceptionFilters() {
        this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
        this.logger.info('Exception filters have been initialized.');
    }

    public async init() {
        this.logger.info('Starting application initialization...');

        const port = this.config.get('PORT');
        const host = this.config.get('HOST');
        const dbConnectionString = this.config.get('DB_CONNECTION_STRING');

        this.logger.info(`Fetched configuration - PORT: ${port}, HOST: ${host}, DB_CONNECTION_STRING: [REDACTED]`);

        try {
            await this.databaseClient.connect(dbConnectionString);
            this.logger.info('Successfully connected to the database.');
        } catch (error) {
            this.logger.error('Database connection failed:', error);
            throw error;
        }

        this.initMiddleware();
        this.initRoutes();
        this.initExceptionFilters();

        this.expressApp.listen(port, () => {
            this.logger.info(`Server is listening on ${getFullServerPath(host, port)}`);
        });
    }
}
