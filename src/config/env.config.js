import { config } from "dotenv";
import z from "zod";
config({path: ".env"});


const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development", "test"]).default("development"),
    PORT: z.string().transform((val) => parseInt(val, 10)).default("10"),
    JWT_ACCESS_SECRET: z.string().min(10, 'JWT_SECRET must be 10 characters long.'),
    JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH must be 10 characters long.'),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(), 
});

const _env = envSchema.safeParse(process.env);

if(!_env.success) {
    console.log("Unable to parse env files data.", _env.error.format());
    process.exit(1);
};

const env = _env;
export default env;
