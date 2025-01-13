const passwordStrength = (req, res, next) => {
    const { password } = req.body;

    // التحقق من وجود كلمة المرور
    if (!password) {
        return res.status(400).json({
            error: 'PASSWORD_REQUIRED',
            message: 'Password is required'
        });
    }

    // التحقق من طول كلمة المرور (8 أحرف على الأقل)
    if (password.length < 8) {
        return res.status(400).json({
            error: 'PASSWORD_TOO_SHORT',
            message: 'Password must be at least 8 characters long'
        });
    }

    // التحقق من وجود حرف كبير
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_UPPERCASE_REQUIRED',
            message: 'Password must contain at least one uppercase letter'
        });
    }

    // التحقق من وجود حرف صغير
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_LOWERCASE_REQUIRED',
            message: 'Password must contain at least one lowercase letter'
        });
    }

    // التحقق من وجود رقم
    if (!/\d/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_NUMBER_REQUIRED',
            message: 'Password must contain at least one number'
        });
    }

    // التحقق من وجود حرف خاص
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_SPECIAL_REQUIRED',
            message: 'Password must contain at least one special character'
        });
    }

    // التحقق من عدم وجود مسافات
    if (/\s/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_NO_SPACES',
            message: 'Password must not contain spaces'
        });
    }

    // التحقق من عدم وجود أنماط متكررة
    if (/(.)\1{2,}/.test(password)) {
        return res.status(400).json({
            error: 'PASSWORD_NO_REPEATING',
            message: 'Password must not contain repeating patterns'
        });
    }

    // إذا اجتازت كلمة المرور جميع الفحوصات
    next();
};

export { passwordStrength };
