import got from 'got';

import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import UserGenerator from '../common/user-generator/user-generator.js';

// Indices for parameters
const COUNT_INDEX = 0;
const FILEPATH_INDEX = 1;
const URL_INDEX = 2;

export default class GenerateCommand implements CliCommandInterface {
    public readonly name = '--generate';
    private initialData!: MockData;

    private async fetchData(url: string): Promise<MockData> {
        try {
            return await got.get(url).json();
        } catch {
            throw new Error(`Can't fetch data from ${url}.`);
        }
    }

    public async execute(...parameters: string[]): Promise<void> {
        const count = Number.parseInt(parameters[COUNT_INDEX], 10);
        const filepath = parameters[FILEPATH_INDEX];
        const url = parameters[URL_INDEX];

        try {
            this.initialData = await this.fetchData(url);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred.');
            }
            return;
        }

        const userGenerator = new UserGenerator(this.initialData);
        const tsvFileWriter = new TSVFileWriter(filepath);

        for (let i = 0; i < count; i++) {
            await tsvFileWriter.write(userGenerator.generate());
        }

        console.log(`File ${filepath} was created!`);
    }
}
