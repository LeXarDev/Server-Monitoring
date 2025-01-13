import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import winston from 'winston';
import jwt from 'jsonwebtoken';

// إعداد نظام التسجيل
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security.log' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ]
});

// Rate limiting لتسجيل الدخول
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 5, // 5 محاولات فقط
    message: { 
        error: 'TOO_MANY_ATTEMPTS',
        message: 'Too many login attempts, please try again later'
    },
    handler: (req, res, next, options) => {
        logger.warn({
            type: 'RATE_LIMIT_EXCEEDED',
            ip: req.ip,
            path: req.path,
            headers: req.headers
        });
        res.status(429).json(options.message);
    }
});

// Rate limiting عام للتطبيق
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// CSRF protection
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

// تنظيف المدخلات
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[<>]/g, '') // منع HTML tags
        .trim(); // إزالة المسافات الزائدة
};

// Middleware لتنظيف جميع المدخلات
const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            req.body[key] = sanitizeInput(req.body[key]);
        }
    }
    if (req.query) {
        for (let key in req.query) {
            req.query[key] = sanitizeInput(req.query[key]);
        }
    }
    next();
};

// Middleware للتحقق من التوكن
const validateToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error({
            type: 'TOKEN_VALIDATION_ERROR',
            error: error.message
        });
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// تسجيل الأحداث الأمنية
const securityLogger = (req, res, next) => {
    logger.info({
        type: 'REQUEST',
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
};

export {
    loginLimiter,
    globalLimiter,
    csrfProtection,
    sanitizeMiddleware,
    validateToken,
    securityLogger,
    logger
};
