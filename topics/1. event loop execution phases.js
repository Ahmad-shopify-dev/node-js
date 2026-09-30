import fs from "node:fs";

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

console.log('1: Sync Code Start');

setTimeout(() => {
  console.log('2: setTimeout (Timer Phase)');
}, 0);

setImmediate(() => {
  console.log('3: setImmediate (Check Phase)');
});

Promise.resolve().then(() => {
  console.log('4: Promise (Microtask)');
});

process.nextTick(() => {
  console.log('5: process.nextTick (Microtask High-Priority)');
});

fs.readFile(__filename, () => {
  console.log('6: I/O Callback (Poll Phase)');
});

console.log('7: Sync Code End');