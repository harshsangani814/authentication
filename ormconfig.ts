import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

// Prefer DATABASE_URL if provided (e.g., for Render/Heroku), fallback to discrete env vars
const databaseUrl = process.env.DATABASE_URL;

const dbPasswordEnv: unknown = process.env.DB_PASS;
let dbPassword = typeof dbPasswordEnv === 'string' ? dbPasswordEnv : String(dbPasswordEnv ?? "");
// Normalize common non-string representations from shells/CI
if (dbPassword === 'undefined' || dbPassword === 'null') dbPassword = '';

if (process.env.DEBUG_DB === 'true') {
    // Only log metadata, never the actual password
    console.log('[DB DEBUG] using DATABASE_URL:', Boolean(databaseUrl));
    console.log('[DB DEBUG] host:', process.env.DB_HOST, 'port:', process.env.Database_PORT ?? process.env.DB_PORT);
    console.log('[DB DEBUG] user:', process.env.DB_USER, 'db:', process.env.DB_NAME);
    console.log('[DB DEBUG] password typeof:', typeof dbPassword, 'length:', dbPassword ? dbPassword.length : 0);
}

export const AppDataSource = new DataSource(
    databaseUrl
        ? {
            type: "postgres",
            url: databaseUrl,
            synchronize: process.env.TYPEORM_SYNC === 'false' ? false : true,
            logging: process.env.TYPEORM_LOGGING === 'true',
            entities: [User],
        }
        : {
            type: "postgres",
            host: (process.env.DB_HOST ?? 'localhost') as string,
            port: Number(process.env.Database_PORT ?? process.env.DB_PORT ?? 5432),
            username: (process.env.DB_USER ?? 'postgres') as string,
            password: dbPassword,
            database: (process.env.DB_NAME ?? 'auth') as string,
            synchronize: process.env.TYPEORM_SYNC === 'false' ? false : true,
            logging: process.env.TYPEORM_LOGGING === 'true',
            entities: [User],
        }
);

export default AppDataSource;