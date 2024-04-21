import { splitFileToSortedBatches } from './utils/batches-sort.js';
import { mergeSortedBatches } from './utils/batches-merge.js';

export const PATH_TO_LOGS_FILE = 'mock_logs.txt';
const PATH_TO_RESULT_FILE = 'result.txt';
const ROWS_PER_BATCH = 5_000;

async function getLogsSortedByTraceIdAndDate() {

    const numberOfBatches = await splitFileToSortedBatches(PATH_TO_LOGS_FILE, ROWS_PER_BATCH);

    await mergeSortedBatches(numberOfBatches, PATH_TO_RESULT_FILE);

}

getLogsSortedByTraceIdAndDate()
    .then(() => console.log( 'Done!' ));


