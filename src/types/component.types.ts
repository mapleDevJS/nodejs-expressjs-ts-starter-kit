export const Component = {
    Application: Symbol.for('Application'),
    LoggerInterface: Symbol.for('LoggerInterface'),
    ConfigInterface: Symbol.for('ConfigInterface'),
    DatabaseInterface: Symbol.for('DatabaseInterface'),
    UserServiceInterface: Symbol.for('UserServiceInterface'),
    UserModel: Symbol.for('UserModel'),
    UserController: Symbol.for('UserController'),
    ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),
    // Add type definitions for your components such as ServiceError, controller here
} as const;
