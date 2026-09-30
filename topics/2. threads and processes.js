// NORMAL EXECUTION OF SYNC CODE AND ASYNC CODE DONE ON V8
// NETWORK REQUESTS AND OTHER NETWORK LOADS TRANSFERRED TO OS KERNAL
// SYSTEM TASKS, HASHING AND FILE READING, DONE ON THREADS 

import crypto from "node:crypto";

const start = Date.now();

function hashingID(id) {
  crypto.pbkdf2("password", "salt", 10000, 512, 'sha512', () => {
    console.log(`Password for ${id} is encrypted at: ${Date.now() - start} ms`)
  })
}

// NODEJS HAS DEFAULT 4 THREAD
hashingID(1); // ON THREAD 1
hashingID(2); // ON THREAD 2
hashingID(3); // ON THREAD 3
hashingID(4); // ON THREAD 4
hashingID(5); // WILL WAIT TO GET THE FREE THREAD


// Password for 3 is encrypted at: 99 ms
// Password for 2 is encrypted at: 106 ms
// Password for 1 is encrypted at: 108 ms
// Password for 4 is encrypted at: 111 ms
// Password for 5 is encrypted at: 181 ms
