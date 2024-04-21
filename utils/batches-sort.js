import * as fs from 'fs';

export async function splitFileToSortedBatches(path, rowsPerBatch) {

    let endOfFileNotReached = true;
    let batchNumber = 1;

    while ( endOfFileNotReached ) {

        const numOfRowsToSkip = (batchNumber - 1) * rowsPerBatch;

        const [ rows, endOfFileReached ] = await readFirstRows(path, rowsPerBatch, numOfRowsToSkip);

        sortRows(rows);

        writeSortedRowsToFile(rows, batchNumber);

        batchNumber++;

        endOfFileNotReached = !endOfFileReached;
    }

    return batchNumber;
}

async function readFirstRows(filePath, numRows, skipRows = 0) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let partialRow = '';

        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        let rowCount = 0;
        let skippedRowCount = 0;

        stream.on('data', (batch) => {
            const lines = (partialRow + batch).split('\n');

            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i];
                if (skippedRowCount < skipRows) {
                    skippedRowCount++;
                    continue;
                }
                if (rowCount < numRows) {
                    rows.push(line);
                    rowCount++;
                } else {
                    stream.close();
                    resolve([rows, false]);
                    return;
                }
            }

            partialRow = lines.pop();
        });

        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('end', () => {
            if (partialRow.trim() !== '') {
                rows.push(partialRow.trim());
            }
            resolve([rows, true]);
        });
    });
}

function sortRows(rows) {

    rows.sort(compareRows);

}

export function compareRows(a, b) {
    const [ traceIdA, dateTimeA ] = extractTraceIdAndDateTimeFromRow(a);
    const [ traceIdB, dateTimeB ] = extractTraceIdAndDateTimeFromRow(b);

    const timeComparison = new Date(dateTimeA).getTime() - new Date(dateTimeB).getTime();

    if (timeComparison === 0) {
        const traceidComparison = traceIdA.localeCompare(traceIdB);
        return traceidComparison;
    }
    return timeComparison;
}

function writeSortedRowsToFile(rows, batchNumber) {

    const batchesDir = './batches';

    if (!fs.existsSync(batchesDir)) {
        fs.mkdirSync(batchesDir);
    }

    const data = rows.join('\n');
    const filePath = `${batchesDir}/_batch${batchNumber}.txt`;

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