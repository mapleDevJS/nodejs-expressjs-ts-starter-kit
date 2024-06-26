import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
    PORT: number;
    DB_CONNECTION_STRING: string;
    UPLOAD_DIRECTORY: string;
    JWT_SECRET: string;
    STATIC_DIRECTORY_PATH: string;
    HOST: string;
};

export const configSchema = convict<ConfigSchema>({
    PORT: {
        doc: 'The port number on which the application will listen for incoming connections. This should be a valid port number between 0 and 65535.',
        format: 'port',
        env: 'PORT',
        default: 3132,
    },
    DB_CONNECTION_STRING: {
        doc: 'The connection string for the MongoDB database. This should include the protocol (e.g., mongodb://), hostname, port, and database name.',
        format: String,
        env: 'DB_CONNECTION_STRING',
        default: '',
    },
    UPLOAD_DIRECTORY: {
        doc: 'The filesystem directory where uploaded files will be stored. This should be an absolute path to a writable directory on the server.',
        format: String,
        env: 'UPLOAD_DIRECTORY',
        default: null,
    },
    JWT_SECRET: {
        doc: 'The secret key used for signing JSON Web Tokens (JWT). This should be a strong, randomly generated string that is kept secret.',
        format: String,
        env: 'JWT_SECRET',
        default: null,
    },
    STATIC_DIRECTORY_PATH: {
        doc: 'The path to the directory containing static resources (e.g., images, stylesheets). This should be an absolute path to the directory on the server.',
        format: String,
        env: 'STATIC_DIRECTORY_PATH',
        default: '/static',
    },
    HOST: {
        doc: 'The hostname or IP address where the service is hosted. This can be set to "localhost" for local development or the actual hostname for production.',
        format: String,
        env: 'HOST',
        default: 'localhost',
    },
});
