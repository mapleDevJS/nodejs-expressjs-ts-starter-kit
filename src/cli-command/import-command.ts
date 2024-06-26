import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createUser, getErrorMessage } from '../utils/common.js';
import DatabaseService from '../common/database-client/database.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import UserService from '../modules/user/user.service.js';
import { UserModel } from '../modules/user/user.entity.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { User } from '../types/user.type.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';

const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
    public readonly name = '--import';
    private readonly userService: UserServiceInterface;
    private readonly databaseService: DatabaseInterface;
    private readonly logger: LoggerInterface;
    private readonly configService: ConfigInterface;

    constructor() {
        this.logger = new ConsoleLoggerService();
        this.userService = new UserService(this.logger, UserModel);
        this.databaseService = new DatabaseService(this.logger);
        this.configService = new ConfigService(this.logger);
        this.bindEvents();
    }

    private bindEvents(): void {
        this.onLine = this.onLine.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    private async saveUser(user: User): Promise<void> {
        await this.userService.findOrCreate({
            ...user,
            password: DEFAULT_USER_PASSWORD,
        });
    }

    private async onLine(line: string, resolve: () => void): Promise<void> {
        const user = createUser(line);
        await this.saveUser(user);
        resolve();
    }

    private async onComplete(count: number): Promise<void> {
        this.logger.info(`${count} rows imported.`);
        await this.databaseService.disconnect();
    }

    public async execute(filename: string): Promise<void> {
        try {
            await this.databaseService.connect(this.configService.get('DB_CONNECTION_STRING'));
            await this.processFile(filename.trim());
        } catch (err) {
            this.logger.error(`Can't read the file: ${getErrorMessage(err)}`);
        }
    }

    private async processFile(filename: string): Promise<void> {
        const fileReader = new TSVFileReader(filename);
        fileReader.on('line', this.onLine);
        fileReader.on('end', this.onComplete);
        await fileReader.read();
    }
}
