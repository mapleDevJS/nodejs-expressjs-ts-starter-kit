import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './database.interface.js';

@injectable()
export default class DatabaseService implements DatabaseInterface {
    constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {}

    public async connect(uri: string): Promise<void> {
        this.logger.info(`Attempting to connect to MongoDB with URI: ${uri}`);
        try {
            await mongoose.connect(uri);
            this.logger.info('Successfully connected to MongoDB.');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to connect to MongoDB. Error: ${error.message}`);
            } else {
                this.logger.error(`Failed to connect to MongoDB. Unknown error: ${String(error)}`);
            }
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        this.logger.info('Attempting to disconnect from MongoDB...');
        try {
            await mongoose.disconnect();
            this.logger.info('Successfully disconnected from MongoDB.');
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to disconnect from MongoDB. Error: ${error.message}`);
            } else {
                this.logger.error(`Failed to disconnect from MongoDB. Unknown error: ${String(error)}`);
            }
            throw error;
        }
    }
}
