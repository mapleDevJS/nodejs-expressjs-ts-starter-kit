import * as crypto from 'node:crypto';

import * as jose from 'jose';
import bcrypt from 'bcrypt';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ServiceError } from '../types/service-error.enum.js';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';
import { User } from '../types/user.type';

export const createUser = (row: string): User => {
    const tokens = row.replace('\n', '').split('\t');
    const [email, avatarPath, firstName, lastName] = tokens;
    return {
        email,
        avatarPath,
        firstName,
        lastName,
    };
};

export const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : '';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
    plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (
    serviceError: ServiceError,
    message: string,
    details: ValidationErrorField[] = [],
) => ({
    errorType: serviceError,
    message,
    details: [...details],
});

export const createJWT = async (
    algorithm: string,
    jwtSecret: string,
    payload: object,
): Promise<string> =>
    new jose.SignJWT({ ...payload })
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        .setExpirationTime('2d')
        .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
    errors.map(({ property, value, constraints }) => ({
        property,
        value,
        messages: constraints ? Object.values(constraints) : [],
    }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
    property: string,
    someObject: UnknownObject,
    transformFn: (object: UnknownObject) => void,
) => {
    Object.keys(someObject).forEach((key) => {
        if (key === property) {
            transformFn(someObject);
        } else if (isObject(someObject[key])) {
            transformProperty(property, someObject[key] as UnknownObject, transformFn);
        }
    });
};

export const transformObject = (
    properties: string[],
    staticPath: string,
    uploadPath: string,
    data: UnknownObject,
) => {
    properties.forEach((property) =>
        transformProperty(property, data, (target: UnknownObject) => {
            const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string)
                ? staticPath
                : uploadPath;
            target[property] = `${rootPath}/${target[property]}`;
        }),
    );
};
