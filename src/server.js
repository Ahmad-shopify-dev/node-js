import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { localCache } from "./config/cache.config.js";
import { logger } from "./utils/utils.logger.js";

const PORT = process.env.PORT || 5000;

// CALLING EXPRESS APP AS SERVER
const server = app.listen(PORT, (error) => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});




// ============================================================
// GRACEFUL SHUTDOWN HANDLER
// ============================================================
const gracefulShutdown = (signal) => {
  logger.warn(`⚠️  ${signal} signal received! Starting Graceful Shutdown...`);

  // 1. Stop accepting NEW HTTP requests
  server.close(async () => {
    logger.info('🛑 HTTP server closed. No longer accepting new connections.');

    try {
      // 2. Close Database Connections / Cache Pools safely
      logger.info('📦 Closing Database & Cache connections...');
      localCache.flushAll(); // Clears memory safely
      // await db.disconnect(); // (Agar real DB ho toh connection close karein)

      logger.info('✅ All connections closed cleanly. Exiting process.');
      process.exit(0); // Success exit code
    } catch (err) {
      logger.error('❌ Error during database/cache disconnect:', err);
      process.exit(1); // Failure exit code
    }
  });

  // 3. Forceful Kill Timeout (If active requests take too long)
  setTimeout(() => {
    logger.error('💥 Forcefully shutting down because active requests timed out!');
    process.exit(1);
  }, 10000); // 10 seconds grace period
};

// Listen for Termination Signals from OS / PM2 / Docker
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ============================================================
// UNHANDLED ERRORS SAFETY NET
// ============================================================
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down process...', reason);
  // Unhandled promise rejection ke baad process restart karna best practice hai
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down process immediately...', err);
  process.exit(1);
});

