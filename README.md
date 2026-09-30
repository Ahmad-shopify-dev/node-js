## libuv -> handle the event loop and threads pool outside the v8 engine of node/javascript

### CODE PROCESS INSIDE NODEJS
01. whole code comes into the callstack
02. sync code gets executed as soon as it comes to the callstack
03. scene starts with the async code
04. libuv comes into piture
05. codes gets separated like it is sent to the libuv
07. v8 engine execute the promisses, process.nextTick get executed from microtask queue on  callstack (always checked, before going to any event phase or in between the event phases)
08. settimeout, setinterval get executed (timer phase)
09. next, files and IO operations get executed (poll phase)
10. finally, setImmediate gets executed (check phase)
11. socket.on(close) get executed (closed phase)
12. $$\text{Sync Code} \longrightarrow \text{Microtasks} \longrightarrow \text{Timers Phase} \longrightarrow \text{Poll Phase (Files/DB/Network)} \longrightarrow \text{Check Phase (setImmediate)} \longrightarrow \text{Close Callbacks}$$

### NOTE
- event loop phases(timers, poll, check, close) always check the microtasks queue before entering any phase or even in the middle of the phases to keep microtasks queue empty.

### THREADS AND PROCESSES
- v8 executes async and sync codes and callbacks
- file reading, heashing and other calculations, done by threads
- network calls and other network tasks, done on OS kernal


### LARGE FILES AND STREAMS
Suppose you have 10GB file and only 512MB RAM. So, what should you do? You will get OOM(OUT OF MEMORY) error.
- Read file with streams only by chunks
- load like 10MB in the RAM and search your content and then return.
- then load the next 10MB of the file

TYPE OF STREAMS
1. readable stream
2. writeable stream
3. duplix stream
4. transform stream

BACKPRESSURE
backpressure is a concept which says that, if your reading capacity if 100MB while writing capacity is only 1MB then 99MB saved in RAM which may cause a problem. So, pipeline basically handles the backpressure and tells the reading source to slow down and let me clean the RAM first then loads next data.


### EVENT EMITTER
EventEmitter is the process of emitting the events automatically. When someone performs an action and you want to track the action you need to do coupling for that i.e.
- when a user place order and you send data to order process, db and much more
- all should have a tight coupling process
- one process fail may slow down the whole process

EventEmitter helps with this to emit the custom events automatically based on actions.


## WHOLE REQUEST PROCESS
01. user put a request 
02. hits on port/kernal
03. security layer (origin, headers, rate limit, request size)
04. processing layer (body parser, cookies, headers)
05. routing layer (where to transfer the user)
06. authentication layer (authorize or not)
07. authorization layer (valid -> has access to get the data or not)
08. data validation layer (schema check layer)
09. controller layer (separate body/request parts, data and variables)
10. service layer (connect to db or do other calculations)
11. http response (sends response to user)


## 1. Executive Summary & Concepts Map

| Topic | Standard Industry Name | Why It Matters in Production |
| --- | --- | --- |
| **Event Loop & Microtasks** | **Node.js Runtime Mechanics** | Single thread execution order samjhne aur non-blocking I/O write karne ke liye. |
| **Libuv & OS Kernel** | **Thread Pool & Non-Blocking I/O** | CPU tasks vs Kernel I/O ka difference (Thread Pool exhaustion se bachne ke liye). |
| **Streams & Buffers** | **Chunk-by-Chunk Memory Stream** | High RAM usage / Heap Out of Memory (OOM) crash ko avoid karne ke liye. |
| **Event Emitter** | **Event-Driven Architecture / Pub-Sub** | Heavy tasks (Emails, Analytics) ko main API flow se decouple karne ke liye. |
| **3-Layer Architecture** | **Separation of Concerns (SoC)** | Code maintainability, unit testing, aur database abstraction ke liye. |
| **`app.js` vs `server.js**` | **App Instantiation vs Lifecycle Management** | Integration testing support aur graceful server shutdowns ke liye. |
| **`next(err)` Pipeline** | **Centralized Error Handling** | Crash prevention, consistent error API response, aur stack trace security ke liye. |
| **Async Wrapper (`catchAsync`)** | **Higher-Order Function Error Catching** | Unhandled Promise Rejections se Express app ko freeze hone se bachane ke liye. |
| **Zod Validation** | **Request Schema Validation** | Malicious inputs aur invalid DB payloads ko layer 1 par hi reject karne ke liye. |
| **Winston + Morgan** | **Structured Asynchronous Logging** | Synchronous `console.log` latency se bachne aur log files (rotations) store karne ke liye. |
| **Dual Token JWT** | **OAuth2-style Access/Refresh Token Flow** | Token theft security (Short-lived Access Token + HttpOnly Secure Cookie Refresh Token). |
| **RBAC** | **Role-Based Access Control Middleware** | Authorization logic (Admin, User, Manager) enforce karne ke liye. |
| **Helmet, CORS & Rate Limit** | **API Security Hardening & DDoS Mitigation** | Brute force, XSS, CSRF, aur excessive payload attacks se system secure karne ke liye. |

---

## 2. Core Architectural Pillars

### Phase 1: Engine Internals

1. **Execution Priority:**

$$\text{Call Stack (Sync)} \longrightarrow \text{Microtasks (process.nextTick } \rightarrow \text{ Promises)} \longrightarrow \text{Event Loop Phases}$$


2. **Event Loop Phases Order:**

$$\text{Timers } \rightarrow \text{ Poll (File I/O) } \rightarrow \text{ Check (setImmediate) } \rightarrow \text{ Close Callbacks}$$


3. **Thread Pool Allocation:** Network requests (`http`/`sockets`) **Native OS Kernel** chalta hai (Zero Threads). File I/O aur Crypto operations **`libuv` Thread Pool** (Default 4 threads) use karte hain.

### Phase 2: Layered Design Pattern

* **Controller Layer:** Only handles `req` / `res`, HTTP status codes, and formatting responses.
* **Service Layer:** Core pure business logic (Hashing, Business Rules, Calculations). Zero Express dependency.
* **Repository Layer:** Raw Data Access (JSON, Array, Mongoose, Prisma, SQL). Hides DB queries from business logic.

### Phase 3: Defensive Security

* **Access Tokens:** Short expiration (~15 mins) passed in `Authorization: Bearer` header.
* **Refresh Tokens:** Long expiration (~7 days) stored inside `HttpOnly`, `Secure`, `SameSite=Strict` Cookie.

---

## 3. Complete End-to-End Request Pipeline Tree

Yeh diagram dikhati hai ke jab ek user browser/Postman se request bhejta hai, toh woh server par kitne checkpoints se guzarti hai:

```text
                                 HTTP REQUEST
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    OS KERNEL & SOCKET PORT    │
                      └───────────────┬───────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │     SECURITY HARDENING LAYER      │
                    │                                   │
                    │ 1. CORS Check (Allowed Origins?)  │
                    │ 2. Helmet (HTTP Security Headers) │
                    │ 3. Rate Limiter (IP Rate Limit?)  │
                    │ 4. Payload Size Limit (<= 10kb)   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │      PRE-PROCESSING MIDDLEWARE    │
                    │                                   │
                    │ 1. Body Parser (express.json)     │
                    │ 2. Cookie Parser (req.cookies)    │
                    │ 3. Morgan Logger (HTTP Request)   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │         ROUTER LAYER              │
                    │  Matches URL Path (/api/v1/...)   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   AUTHENTICATION (protect)        │
                    │                                   │
                    │ 1. Read Bearer Token Header       │
                    │ 2. Verify Access Token (JWT)      │
                    │ 3. Attach req.user Payload        │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   AUTHORIZATION (restrictTo)      │
                    │                                   │
                    │ Check Role (e.g., req.user.role)  │
                    │ Allowed: Pass | Disallowed: 403   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   INPUT VALIDATION (Zod Middleware│
                    │                                   │
                    │ Validate Body, Params, Query      │
                    │ Valid: Pass | Invalid: 400 Bad Req│
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │          CONTROLLER LAYER         │
                    │                                   │
                    │ 1. Extracts Params/Body           │
                    │ 2. Calls Service Layer            │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │           SERVICE LAYER           │
                    │                                   │
                    │ 1. Executes Pure Business Logic   │
                    │ 2. Calls Repository Layer         │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │          REPOSITORY LAYER         │
                    │                                   │
                    │ Reads / Writes to DB (JSON/Data)  │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │          HTTP RESPONSE            │
                    │                                   │
                    │ Controller sends res.status().json│
                    └───────────────────────────────────┘

  ══════════════════════════════════════════════════════════════════
  
  [ IF ANY ERROR OCCURS AT ANY POINT ] ──► next(err) / Throw Error
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │     GLOBAL ERROR HANDLER        │
                               │   (err, req, res, next)         │
                               │                                 │
                               │ 1. Log Stack via Winston        │
                               │ 2. Format Sanitized Error JSON  │
                               │ 3. Send Status (4xx or 5xx)     │
                               └─────────────────────────────────┘

```


---

## 1. Phase 4 Summary Table

| Feature / Topic | Production Concept | Why It Matters |
| --- | --- | --- |
| **Local In-Memory Caching** | **Cache-Aside Pattern (`node-cache`)** | Fast responses (~0.1ms) without external DB overhead or extra infrastructure costs. |
| **Cache Invalidation** | **Explicit Key Purging** | Prevents stale/outdated data delivery when records are mutated (`POST`/`PUT`/`DELETE`). |
| **Process Clustering** | **Multi-Core Utilization (PM2)** | Utilizes all available CPU cores instead of locking Node.js to a single thread/core. |
| **Process Management** | **Zero-Downtime Reloads** | Keeps the server running 24/7 with instant auto-restarts on crash or code deployment. |
| **Graceful Shutdown** | **Signal Trapping (`SIGTERM`/`SIGINT`)** | Prevents data corruption, completes in-flight requests, and closes DB connections safely. |

---

## 2. In-Memory Caching Architecture (`node-cache`)

### Read & Write Cycle Flow

```text
               GET Request (/api/v1/products)
                             │
                             ▼
                 ┌──────────────────────┐
                 │   cacheMiddleware    │
                 └───────────┬──────────┘
                             │
                  Check Local RAM Storage
                             │
             ┌───────────────┴───────────────┐
             │                               │
       [ Cache HIT ]                   [ Cache MISS ]
             │                               │
   Return Data from RAM             Execute Controller Logic
   (Response in ~0.1ms)                      │
                                    Store Result in RAM (TTL)
                                             │
                                    Return Fresh Response

```

### Invalidation Flow on Data Mutation

```text
   PUT / POST / DELETE Request ──► Execute DB/File Write ──► invalidateCache('/api/v1/products')
                                                                     │
                                                           Purges Stale Memory

```

---

## 3. Multi-Core Scaling Configuration (`ecosystem.config.cjs`)

To scale across all available CPU cores using PM2 without changing core application logic:

```javascript
module.exports = {
  apps: [
    {
      name: 'production-backend',
      script: 'src/server.js',
      instances: 'max', // Automatically spawns workers equal to available CPU cores
      exec_mode: 'cluster', // Enables Node.js cluster mode
      max_memory_restart: '500M', // Auto-restarts worker if RAM exceeds 500MB
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

```

---

## 4. Graceful Shutdown Flow Diagram

When PM2, Docker, or OS sends a termination signal (`SIGTERM` / `SIGINT`):

```text
                      OS Signal Received (SIGTERM / SIGINT)
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │    Stop Accepting New HTTP Requests   │
                   │            (server.close)             │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │     Wait for In-Flight Requests       │
                   │        to Finish (Grace Period)       │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │   Safely Close DB / Cache Connections │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │          Exit Process (0)             │
                   └───────────────────────────────────────┘

```

---

## 5. Complete Production `src/server.js` Template

```javascript
import app from './app.js';
import { logger } from './utils/logger.js';
import { env } from './config/env.js';
import { localCache } from './config/cache.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`⚙️  Worker process ${process.pid} running on Port ${PORT}`);
});

// ==========================================
// GRACEFUL SHUTDOWN HANDLER
// ==========================================
const gracefulShutdown = (signal) => {
  logger.warn(`⚠️  ${signal} signal received! Starting Graceful Shutdown...`);

  // 1. Stop accepting new requests
  server.close(async () => {
    logger.info('🛑 HTTP server closed. No longer accepting new connections.');

    try {
      // 2. Clean up connections & memory
      logger.info('📦 Flushing local memory cache & closing connections...');
      localCache.flushAll();

      logger.info('✅ Clean shutdown complete. Exiting process.');
      process.exit(0);
    } catch (err) {
      logger.error('❌ Error during cleanup:', err);
      process.exit(1);
    }
  });

  // 3. Force exit fallback if requests take too long
  setTimeout(() => {
    logger.error('💥 Forcefully shutting down due to timeout!');
    process.exit(1);
  }, 10000);
};

// OS Listeners
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled Crash Safety Net
process.on('unhandledRejection', (reason) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down worker...', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Immediate shutdown...', err);
  process.exit(1);
});

```



