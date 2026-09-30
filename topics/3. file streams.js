import fs from "node:fs";

const stream = fs.createReadStream("dummy-text.txt", {
  encoding: "utf-8",
  highWaterMark: 10 * 1024 * 1024, // USE 10MB OF RAM ONLY
});

let chunkNumber = 0;
let leftOverText = "";
let textToFind = "hello how are you.";

stream.on("data", (chunk) => {
  chunkNumber++;

  console.log(`\n Chunk number ${chunkNumber} is loaded....`);
  console.log(`\n Chunk size ${(Buffer.byteLength(chunk) / 1024 / 1024).toFixed(2)} MB.`);

  const data = leftOverText + chunk;

  if(data.includes(textToFind)) {
    console.log(`\n Data found in chunk ${chunkNumber}`);
  }


  leftOverText = data.slice(-(textToFind.length - 1));
  console.log(`\n ✅ Chunk ${chunkNumber} processed successfully.`)

});

stream.on("end", () => {
  console.log("_____ END OF STREAM READING _____");
})

stream.on("error", (error) => {
  console.log("Error while reding: ", error.message);
});



// PIPELINE BACKPRESSURE KO CONTROLE KARTA HAY
// const http = require('http');
// const fs = require('fs');
// const { pipeline } = require('stream');

// const server = http.createServer((req, res) => {
//   // Safe & Memory Efficient Way
//   const readStream = fs.createReadStream('./huge-log-file.log');

//   // pipeline automatically handles backpressure and cleans up memory on errors!
//   pipeline(readStream, res, (err) => {
//     if (err) {
//       console.error('Pipeline failed:', err);
//       res.statusCode = 500;
//       res.end('Internal Server Error');
//     } else {
//       console.log('Pipeline succeeded.');
//     }
//   });
// });

// server.listen(3000);

