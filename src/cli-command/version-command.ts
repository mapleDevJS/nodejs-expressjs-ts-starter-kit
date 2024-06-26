import { readFileSync } from 'node:fs';

import { CliCommandInterface } from './cli-command.interface.js';

const PACKAGE_JSON_PATH = './package.json';

export default class VersionCommand implements CliCommandInterface {
    public readonly name = '--version';

    private getVersion(): string {
        return this.readVersionFromFile(PACKAGE_JSON_PATH);
    }

    private readVersionFromFile(filePath: string): string {
        const contentPageJSON = readFileSync(filePath, 'utf-8');
        const content = JSON.parse(contentPageJSON);
        return content.version;
    }

    public async execute() {
        const version = this.getVersion();
        console.log(version);
    }
}
