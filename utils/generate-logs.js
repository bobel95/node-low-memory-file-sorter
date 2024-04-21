import * as fs from 'fs';

export const NUM_OF_ROWS_TO_GENERATE = 90_000;
export const AVG_SIZE_OF_ONE_ROW_IN_BYTES = 68;

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function generateTraceId() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 12;
    let result = '';
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
  
function generateMachine() {
    return `machine${generateRandomNumber(1, 10)}`;
}
  
function generateDateTime() {
    const year = 2024;
    const month = generateRandomNumber(1, 12);
    const day = generateRandomNumber(1, 28);
    const hour = generateRandomNumber(0, 23);
    const minute = generateRandomNumber(0, 59);
    const second = generateRandomNumber(0, 59);
    const millisecond = generateRandomNumber(0, 999);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
}

function generatePath() {
    return `/path/to/file${generateRandomNumber(1, 10)}:line${generateRandomNumber(1, 300)}`
}
  
export function generateMockLogs() {
    let logs = '';
    for (let i = 0; i < NUM_OF_ROWS_TO_GENERATE; i++) {
      logs += `${generateTraceId()}\t${generateMachine()}\t${generateDateTime()}\t${generatePath()}\n`;
    }
    
    fs.writeFileSync('mock_logs.txt', logs);

    const sizeOfFile = (NUM_OF_ROWS_TO_GENERATE * AVG_SIZE_OF_ONE_ROW_IN_BYTES / 1_000_000).toLocaleString(
        'en-US',
        { minimumFractionDigits: 2 }
      );
    console.log(`Logs generated successfully - ${NUM_OF_ROWS_TO_GENERATE} rows - File Size ≈ ${sizeOfFile} MB`);
}

generateMockLogs();


  
