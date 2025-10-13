"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
// Prefer DATABASE_URL if provided (e.g., for Render/Heroku), fallback to discrete env vars
const databaseUrl = process.env.DATABASE_URL;
const dbPasswordEnv = process.env.DB_PASS;
let dbPassword = typeof dbPasswordEnv === 'string' ? dbPasswordEnv : String(dbPasswordEnv ?? "");
// Normalize common non-string representations from shells/CI
if (dbPassword === 'undefined' || dbPassword === 'null')
    dbPassword = '';
if (process.env.DEBUG_DB === 'true') {
    // Only log metadata, never the actual password
    console.log('[DB DEBUG] using DATABASE_URL:', Boolean(databaseUrl));
    console.log('[DB DEBUG] host:', process.env.DB_HOST, 'port:', process.env.Database_PORT ?? process.env.DB_PORT);
    console.log('[DB DEBUG] user:', process.env.DB_USER, 'db:', process.env.DB_NAME);
    console.log('[DB DEBUG] password typeof:', typeof dbPassword, 'length:', dbPassword ? dbPassword.length : 0);
}
exports.AppDataSource = new typeorm_1.DataSource(databaseUrl
    ? {
        type: "postgres",
        url: databaseUrl,
        synchronize: process.env.TYPEORM_SYNC === 'false' ? false : true,
        logging: process.env.TYPEORM_LOGGING === 'true',
        entities: [User_1.User],
    }
    : {
        type: "postgres",
        host: (process.env.DB_HOST ?? 'localhost'),
        port: Number(process.env.Database_PORT ?? process.env.DB_PORT ?? 5432),
        username: (process.env.DB_USER ?? 'postgres'),
        password: dbPassword,
        database: (process.env.DB_NAME ?? 'auth'),
        synchronize: process.env.TYPEORM_SYNC === 'false' ? false : true,
        logging: process.env.TYPEORM_LOGGING === 'true',
        entities: [User_1.User],
    });
exports.default = exports.AppDataSource;
