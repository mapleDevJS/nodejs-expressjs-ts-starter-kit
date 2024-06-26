export interface LoggerInterface<T extends unknown[] = unknown[]> {
    info(message: string, ...args: T): void;
    warn(message: string, ...args: T): void;
    error(message: string, ...args: T): void;
    debug(message: string, ...args: T): void;
}
