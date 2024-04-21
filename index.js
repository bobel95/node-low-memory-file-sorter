import * as fs from 'fs';

const PATH_TO_FILE = '/Users/bobel/Coding/node/c64-logs-sorter/generated_logs.txt';
const ROWS_PER_BATCH = 5_000;

async function getLogsSortedByTraceIdAndDate() {

    let endOfFileNotReached = true;
    let batchNumber = 1;

    while ( endOfFileNotReached ) {

        const numOfRowsToSkip = batchNumber * ROWS_PER_BATCH;

        const rows = await readFirstRows(PATH_TO_FILE, ROWS_PER_BATCH, numOfRowsToSkip);

        sortRows(rows);

        writeSortedRowsToFile(rows, batchNumber);

        batchNumber++;

        endOfFileNotReached = rows.length >= ROWS_PER_BATCH;

    }

}

async function readFirstRows(filePath, numRows, skipRows = 0) {
    return new Promise((resolve, reject) => {
        console.log(skipRows);
        const rows = [];
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        let rowCount = 0;
        let skippedRowCount = 0;

        stream.on('data', (batch) => {
            const batchRows = batch.split('\n');

            for (const row of batchRows) {
                if (skippedRowCount < skipRows) {
                    skippedRowCount++;
                    continue;
                }
                if (rowCount < numRows) {
                    rows.push(row);
                    rowCount++;
                } else {
                    stream.close();
                    resolve(rows);
                    return;
                }
            }
        });

        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('end', () => {
            resolve(rows);
        });
    });
}

function sortRows(rows) {

    rows.sort((a, b) => {

        const [ traceIdA, dateTimeA ] = extractTraceIdAndDateTimeFromRow(a);
        const [ traceIdB, dateTimeB ] = extractTraceIdAndDateTimeFromRow(b);

        const timeComparison = new Date(dateTimeA).getTime() - new Date(dateTimeB).getTime();

        if (timeComparison === 0) {
            const traceidComparison = traceIdA.localeCompare(traceIdB);
            return traceidComparison;
        }
        return timeComparison;
      });

}

function writeSortedRowsToFile(rows, batchNumber) {

    const data = rows.join('\n');
    const filePath = `batch${batchNumber}.txt`;

    fs.writeFile(filePath, data, (e) => {
        if( e ) {
            console.error(`Oops, couldn't write file ${filePath}`. e);
        } else {
            console.log(`${filePath} written successfully`);
        }
    })

}

function extractTraceIdAndDateTimeFromRow(row) {

    const [ traceId, _,  dateTime] = row.split('\t');

    return [ traceId, dateTime ];
}

getLogsSortedByTraceIdAndDate();