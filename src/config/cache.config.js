// WE USE REDDIS OR UPSTASH FOR THIS PROCESS

import NodeCache from "node-cache";


export const localCache = new NodeCache({
    stdTTL: 3000, // 5 minutes
    checkperiod: 60 // 1 minute
});
