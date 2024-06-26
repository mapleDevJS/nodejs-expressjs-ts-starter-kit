import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
    constructor(public filename: string) {
        super();
    }

    public async read(): Promise<void> {
        const stream = createReadStream(this.filename, {
            highWaterMark: 16384, // 16KB
            encoding: 'utf-8',
        });

        let lineRead = '';
        let endLinePosition = -1;
        let importedRowCount = 0;

        for await (const chunk of stream) {
            lineRead += chunk.toString();

            while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
                const completeRow = lineRead.slice(0, endLinePosition + 1);
                lineRead = lineRead.slice(++endLinePosition);
                importedRowCount++;

                await new Promise((resolve) => {
                    this.emit('line', completeRow, resolve);
                });
            }
        }

        this.emit('end', importedRowCount);
    }
}
