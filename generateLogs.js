import * as fs from 'fs';

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
  
    let logs = '';
    for (let i = 0; i < 90000; i++) {
      logs += `${generateTraceId()}\t${generateMachine()}\t${generateDateTime()}\t${generatePath()}\n`;
    }
    
    fs.writeFileSync('generated_logs.txt', logs);
    console.log('Logs generated successfully.');
  
