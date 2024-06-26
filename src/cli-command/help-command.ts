import chalk from 'chalk';

import { CliCommandInterface } from './cli-command.interface.js';
export default class HelpCommand implements CliCommandInterface {
    public readonly name = '--help';
    public async execute(): Promise<void> {
        const title = chalk.bold.hex('#06989a');
        const subTitle = chalk.hex('#06989a');
        const comment = chalk.hex('#ad7fa8');
        const text = chalk.bold.hex('#75507b');
        console.log(
            text(
                `
        ${title('Program to prepare data for the REST API server.')}
        ${subTitle('Example:')}
            main.js --<command> [--arguments]
        ${subTitle('Commands:')}
            --version:                   ${comment('# prints the version number')}
            --help:                      ${comment('# prints this text')}
            --import <path>:             ${comment('# imports data from TSV')}
                                         ${comment('# npm run ts src/cli.ts -- --import mocks/mock-data.tsv')}
            --generate <n> <path> <url>  ${comment('# generates a random amount of test data')}
                                         ${comment('# example: npm run ts -- src/cli.ts --generate 20 ./mocks/mock-data.tsv http:localhost:3123/api')}
        `,
            ),
        );
    }
}
