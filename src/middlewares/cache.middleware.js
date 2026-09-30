// WE USE UPSTASH OR REDDIS FOR THIS PURPOSE
import { localCache } from "../config/cache.config.js";
import { logger } from "../utils/utils.logger.js";

export const cacheMiddleware = (ttlSeconds = 300) => {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;

        // CHECK THE CACHE EXISTED
        const cachedData = localCache.get(key);
        if(cachedData) {
            logger.info(`Cached data hitted for: ${key}`);
            return res.status(200).json({
                success: true,
                data: cachedData,
                error: null,
                source: 'node-cache'
            })
        }

        logger.info(`Normal data fetched for: ${key}`);
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if(res.statusCode === 200 && body.data) {
                localCache.set(key, body.data, ttlSeconds);
            }
            return originalJson(body);
        }
        next();
    }
}

export const invalidateCache = (invalidateKey) => {
    localCache.del(invalidateKey);
}
