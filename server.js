import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { auth } from 'express-oauth2-jwt-bearer';

import {
    loginLimiter,
    globalLimiter,
    csrfProtection,
    sanitizeMiddleware,
    validateToken,
    securityLogger,
    logger
} from './middleware/security.js';

import { passwordStrength } from './middleware/passwordStrength.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
    Pool
} = pg;
dotenv.config();

// Ensure uploads directory exists with secure permissions
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o750 });
}

// Configure multer for file uploads with additional security
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate secure random filename
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const safeExtname = path.extname(file.originalname).toLowerCase();
        cb(null, `${randomBytes}${safeExtname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file per request
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
        
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Invalid file extension.'));
        }
        
        cb(null, true);
    }
});

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(globalLimiter);
app.use(sanitizeMiddleware);
app.use(securityLogger);

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Successfully connected to database');
        console.log('Database time:', res.rows[0]);
    }
});

// Initialize database tables
async function initializeTables() {
    try {
        // Get current database time
        const timeResult = await pool.query('SELECT NOW()');
        console.log('Database time:', timeResult.rows[0]);

        // Create the users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                auth0_id VARCHAR(255) UNIQUE,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                full_name VARCHAR(100),
                bio TEXT,
                avatar_url VARCHAR(255),
                phone VARCHAR(20),
                location VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create the login_history table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS login_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                ip_address VARCHAR(255) NOT NULL,
                user_agent TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create the profiles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                full_name VARCHAR(255),
                bio TEXT,
                phone VARCHAR(50),
                location VARCHAR(255),
                avatar_url VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create the servers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS servers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
}

// Initialize tables when the server starts
initializeTables();

// Auth0 Configuration
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// Auth0 callback endpoint
app.post('/auth/callback', checkJwt, async (req, res) => {
    try {
        const { user } = req.body;
        
        if (!user || !user.sub) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        // Check if user exists
        const userResult = await pool.query(
            'SELECT * FROM users WHERE auth0_id = $1',
            [user.sub]
        );

        if (userResult.rows.length === 0) {
            // Create new user
            const newUser = await pool.query(
                'INSERT INTO users (auth0_id, email, full_name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
                [user.sub, user.email, user.name]
            );
            
            return res.json({
                message: 'User created successfully',
                user: newUser.rows[0]
            });
        }

        // Update existing user
        const updatedUser = await pool.query(
            'UPDATE users SET email = $1, full_name = $2, updated_at = NOW() WHERE auth0_id = $3 RETURNING *',
            [user.email, user.name, user.sub]
        );

        return res.json({
            message: 'User updated successfully',
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error('Auth callback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Auth routes
app.post('/api/auth/callback', async (req, res) => {
    try {
        const { user } = req.body;
        
        // Check if user exists in database
        const userResult = await pool.query(
            'SELECT * FROM users WHERE auth0_id = $1',
            [user.sub]
        );

        if (userResult.rows.length === 0) {
            // Create new user if doesn't exist
            await pool.query(
                'INSERT INTO users (auth0_id, email, username) VALUES ($1, $2, $3)',
                [user.sub, user.email, user.nickname || user.email.split('@')[0]]
            );
        }

        res.json({ message: 'Authentication successful' });
    } catch (error) {
        console.error('Auth callback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected route example
app.get('/api/protected', checkJwt, (req, res) => {
    res.json({ message: 'This is a protected endpoint' });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // التحقق من البيانات
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // التحقق من تنسيق البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // التحقق من وجود المستخدم
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء المستخدم
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
            [username, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/auth/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // التحقق من البيانات
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // البحث عن المستخدم
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // إنشاء توكن
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // تسجيل عملية تسجيل الدخول
        await pool.query(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
            [user.id, req.ip, req.headers['user-agent']]
        );

        // إرسال الرد
        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Profile endpoints
app.get('/auth/check', authenticateToken, async (req, res) => {
    try {
        const userResult = await pool.query(
            'SELECT id, email, username, avatar_url FROM users WHERE id = $1',
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/profile/:userId', authenticateToken, async (req, res) => {
    try {
        console.log('=== Profile Request Start ===');
        const { userId } = req.params;
        console.log('Profile request for userId:', userId);
        console.log('Authenticated user:', req.user);
        console.log('Request headers:', req.headers);
        
        // التحقق من أن المستخدم يحاول الوصول إلى ملفه الشخصي فقط
        if (parseInt(userId) !== req.user?.id) {
            console.log('Forbidden: userId mismatch', { requestedId: userId, authenticatedId: req.user?.id });
            return res.status(403).json({ error: 'Forbidden' });
        }

        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected to database');

        try {
            // أولاً، احصل على معلومات المستخدم
            console.log('Fetching user info for userId:', userId);
            const userResult = await client.query(
                'SELECT id, username, email FROM users WHERE id = $1',
                [userId]
            );
            console.log('User query result:', userResult.rows);

            if (userResult.rows.length === 0) {
                console.error('User not found:', userId);
                return res.status(404).json({ error: 'User not found' });
            }

            // ثم احصل على الملف الشخصي
            console.log('Fetching profile for userId:', userId);
            const profileResult = await client.query(
                'SELECT * FROM profiles WHERE user_id = $1',
                [userId]
            );
            console.log('Profile query result:', profileResult.rows);

            if (profileResult.rows.length === 0) {
                console.log('No profile found, creating new one for userId:', userId);
                // إذا لم يكن هناك ملف شخصي، قم بإنشاء واحد
                const newProfile = await client.query(
                    'INSERT INTO profiles (user_id) VALUES ($1) RETURNING *',
                    [userId]
                );
                console.log('New profile created:', newProfile.rows[0]);
                
                const response = {
                    ...newProfile.rows[0],
                    username: userResult.rows[0]?.username,
                    email: userResult.rows[0]?.email
                };
                console.log('Sending new profile response:', response);
                return res.json(response);
            } else {
                const response = {
                    ...profileResult.rows[0],
                    username: userResult.rows[0]?.username,
                    email: userResult.rows[0]?.email
                };
                console.log('Sending existing profile response:', response);
                return res.json(response);
            }
        } catch (err) {
            console.error('Database error:', err);
            console.error('Error stack:', err.stack);
            console.error('Error details:', {
                code: err.code,
                message: err.message,
                detail: err.detail
            });
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: err.message,
                code: err.code
            });
        } finally {
            console.log('Releasing database connection');
            client.release();
        }
    } catch (err) {
        console.error('Outer error:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
    console.log('=== Profile Request End ===');
});

app.put('/profile/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    const { full_name, bio, phone, location } = req.body;
    
    // التحقق من أن المستخدم يحاول تحديث ملفه الشخصي فقط
    if (parseInt(userId) !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE profiles 
             SET full_name = COALESCE($1, full_name),
                 bio = COALESCE($2, bio),
                 phone = COALESCE($3, phone),
                 location = COALESCE($4, location),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $5
             RETURNING *`,
            [full_name, bio, phone, location, userId]
        );

        if (result.rows.length === 0) {
            // إذا لم يكن هناك ملف شخصي، قم بإنشاء واحد
            const newProfile = await client.query(
                `INSERT INTO profiles 
                 (user_id, full_name, bio, phone, location) 
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, full_name, bio, phone, location]
            );
            res.json(newProfile.rows[0]);
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Profile image upload endpoint
app.post('/profile/:userId/image', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Verify user is updating their own profile
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get the file path relative to the uploads directory
        const avatarUrl = `/uploads/${req.file.filename}`;

        // Update the user's profile with the new avatar URL
        const query = `
            UPDATE users 
            SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING *
        `;
        
        const result = await pool.query(query, [avatarUrl, userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            message: 'Profile image updated successfully',
            avatarUrl: avatarUrl
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
});

app.post('/users/:userId/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = parseInt(req.params.userId);
        
        // Verify user is updating their own profile
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;

        // Update the profile with the new avatar URL
        await pool.query(
            'UPDATE profiles SET avatar_url = $1 WHERE user_id = $2 RETURNING *',
            [avatarUrl, userId]
        );

        res.json({
            success: true,
            avatar_url: avatarUrl
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

// Change password endpoint
app.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Verify current password
        const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Password change route
app.post('/auth/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const client = await pool.connect();
    
    try {
        const userResult = await client.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await client.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Server routes
app.get('/api/servers', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM servers WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/servers', authenticateToken, async (req, res) => {
    const { name, address } = req.body;
    const userId = req.user.id;

    console.log('Adding server request:', { userId, name, address });

    if (!name || !address) {
        console.log('Validation failed: Missing name or address');
        return res.status(400).json({ error: 'Name and address are required' });
    }

    try {
        console.log('Executing query to add server...');
        const result = await pool.query(
            'INSERT INTO servers (user_id, name, address) VALUES ($1, $2, $3) RETURNING id, name, address, created_at',
            [userId, name, address]
        );

        const newServer = {
            ...result.rows[0],
            geoLocation: null // We'll add geolocation data later
        };

        console.log('Server added successfully:', newServer);
        res.json(newServer);
    } catch (error) {
        console.error('Detailed error adding server:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            table: error.table,
            constraint: error.constraint
        });
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.delete('/api/servers/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const serverId = req.params.id;

    try {
        const result = await pool.query(
            'DELETE FROM servers WHERE id = $1 AND user_id = $2 RETURNING *',
            [serverId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Server not found' });
        }

        res.json({ message: 'Server deleted successfully' });
    } catch (error) {
        console.error('Error deleting server:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running'
    });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
