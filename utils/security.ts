import DOMPurify from 'isomorphic-dompurify';

/**
 * تنظيف المدخلات من أي محتوى ضار
 */
export function sanitizeInput(input: string | null | undefined): string {
    if (!input) return '';
    return DOMPurify.sanitize(input);
}

/**
 * التحقق من قوة كلمة المرور
 * - يجب أن تكون 8 أحرف على الأقل
 * - يجب أن تحتوي على حرف كبير واحد على الأقل
 * - يجب أن تحتوي على حرف صغير واحد على الأقل
 * - يجب أن تحتوي على رقم واحد على الأقل
 * - يجب أن تحتوي على رمز خاص واحد على الأقل
 */
export function validatePassword(password: string): boolean {
    if (!password) return false;
    
    // التحقق من طول كلمة المرور (8 أحرف على الأقل)
    if (password.length < 8) return false;
    
    // التحقق من وجود حرف كبير
    if (!/[A-Z]/.test(password)) return false;
    
    // التحقق من وجود حرف صغير
    if (!/[a-z]/.test(password)) return false;
    
    // التحقق من وجود رقم
    if (!/\d/.test(password)) return false;
    
    // التحقق من وجود حرف خاص
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    
    return true;
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function validateEmail(email: string): boolean {
    if (typeof email !== 'string') {
        return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * التحقق من نوع الملف وحجمه
 */
export function validateFile(file: File, allowedTypes: string[], maxSizeInMB: number): boolean {
    if (!file) return false;

    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;

    return isValidType && isValidSize;
}

/**
 * إنشاء توكن CSRF
 */
export function generateCSRFToken(): string {
    if (typeof window === 'undefined') {
        return '';
    }
    
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * التحقق من صحة رقم الهاتف
 */
export function validatePhoneNumber(phone: string): boolean {
    if (typeof phone !== 'string') {
        return false;
    }
    
    // يقبل الأرقام والمسافات والشرط والقوسين
    const phoneRegex = /^[\d\s+()-]{8,15}$/;
    return phoneRegex.test(phone);
}

/**
 * التعامل مع الاستجابة
 */
export function handleResponse(response: Response) {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
