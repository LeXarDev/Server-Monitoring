import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf-8');

        // Execute the schema
        await query(schema);
        console.log('Database schema has been successfully created!');

    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

// Run the setup
setupDatabase();
