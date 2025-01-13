import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database');
        
        // Test query
        const result = await client.query('SELECT NOW()');
        console.log('Database time:', result.rows[0].now);
        
        client.release();
        console.log('Connection test completed successfully');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        // Close the pool
        await pool.end();
    }
}

testConnection();
