import * as fs from 'fs';
import { compareRows } from './batches-sort.js';


export async function mergeSortedBatches(numberOfBatches, resultFilePath) {

    const batchFiles = []
    for ( let i = 1; i < numberOfBatches; i++ ) {
        batchFiles.push( `batches/_batch${i}.txt` );
    }

    const resultStream = fs.createWriteStream(resultFilePath);
    const pointers = Array(numberOfBatches).fill(0);

    let rowsWritten = 0;

    console.log(`Starting to write to the result to the ${resultFilePath} file...`);

    while( true ) {

        let nextRow = null;
        let nextRowIdx = null;

        for( let i = 0; i < batchFiles.length; i++ ) {

            const row = await readRowAtIndex(batchFiles[i], pointers[i]);

            if( row !== null && (nextRow === null || compareRows(row, nextRow) <= 0 ) ) {
                nextRow = row;
                nextRowIdx = i;
            }

        }

        if( nextRow === null ) {
            break;
        }

        resultStream.write(nextRow + '\n');
        rowsWritten++;

        if( rowsWritten % 5000 === 0 ) {
            console.log( `${rowsWritten} rows written to ${resultFilePath}` );
        }
        pointers[nextRowIdx]++;
    }

    resultStream.end();

}

async function readRowAtIndex(filePath, index) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        let rowCount = 0;
        let partialRow = '';

        stream.on('data', (batch) => {
            const rows = (partialRow + batch).split('\n');

            for (const row of rows) {
                if (rowCount === index) {
                    stream.close();
                    resolve(row);
                    return;
                }
                rowCount++;
            }

            partialRow = rows.pop();
        });

        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('end', () => {
            resolve(null);
        });
    });
}