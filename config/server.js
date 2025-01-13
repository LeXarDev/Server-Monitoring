import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const serverConfig = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    corsOptions: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },
    security: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiration: '1h',
        refreshTokenExpiration: '7d',
        bcryptSaltRounds: 10
    }
};
