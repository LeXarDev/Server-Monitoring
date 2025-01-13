# Ping Checker 🌐 | فاحص البينج

[English](#english) | [العربية](#arabic)

---

<a name="english"></a>
# English

## Project Overview 📋
Ping Checker is a web application that allows users to monitor and track the status of their servers in real-time. Users can add multiple servers, track their uptime, and receive notifications when servers go down or experience connectivity issues.

### Key Features 🌟
- Real-time server monitoring
- User authentication and authorization
- Server status history tracking
- Profile management
- Responsive modern UI

## Installation Guide 🚀

### Prerequisites
- Node.js (v22.11.0 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone [repository-url]
cd project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

### Step 4: Database Setup
1. Make sure PostgreSQL is running
2. Run the database setup script:
```bash
npm run setup-db
```

### Step 5: Start the Application
```bash
# Development mode
npm run dev:all

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:5173`

---

<a name="arabic"></a>
# العربية

## نظرة عامة على المشروع 📋
فاحص البينج هو تطبيق ويب يتيح للمستخدمين مراقبة حالة خوادمهم وتتبعها في الوقت الفعلي. يمكن للمستخدمين إضافة عدة خوادم ومراقبة مدى توفرها وتلقي إشعارات عند توقف الخوادم أو مواجهة مشاكل في الاتصال.

### الميزات الرئيسية 🌟
- مراقبة الخوادم في الوقت الفعلي
- نظام تسجيل الدخول وإدارة المستخدمين
- تتبع سجل حالة الخوادم
- إدارة الملف الشخصي
- واجهة مستخدم عصرية ومتجاوبة

## دليل التثبيت 🚀

### المتطلبات الأساسية
- Node.js (الإصدار 22.11.0 أو أحدث)
- PostgreSQL (الإصدار 14 أو أحدث)
- npm أو yarn كمدير للحزم

### الخطوة 1: استنساخ المشروع
```bash
git clone [رابط-المستودع]
cd project
```

### الخطوة 2: تثبيت الاعتماديات
```bash
npm install
```

### الخطوة 3: إعداد ملف البيئة
قم بإنشاء ملف `.env` في المجلد الرئيسي مع المتغيرات التالية:
```env
DB_USER=اسم_مستخدم_قاعدة_البيانات
DB_HOST=مضيف_قاعدة_البيانات
DB_NAME=اسم_قاعدة_البيانات
DB_PASSWORD=كلمة_مرور_قاعدة_البيانات
DB_PORT=5432
```

### الخطوة 4: إعداد قاعدة البيانات
1. تأكد من تشغيل PostgreSQL
2. قم بتشغيل سكريبت إعداد قاعدة البيانات:
```bash
npm run setup-db
```

### الخطوة 5: تشغيل التطبيق
```bash
# وضع التطوير
npm run dev:all

# وضع الإنتاج
npm run build
npm start
```

سيكون التطبيق متاحاً على الرابط `http://localhost:5173`

## هيكل قاعدة البيانات 💾

### الجداول الرئيسية:
- `users`: معلومات المستخدمين الأساسية
- `profiles`: الملفات الشخصية للمستخدمين
- `servers`: معلومات الخوادم المراقَبة
- `login_history`: سجل تسجيل الدخول
- `refresh_tokens`: إدارة جلسات المستخدمين
- `password_reset_tokens`: طلبات إعادة تعيين كلمة المرور

---

## التقنيات المستخدمة 🛠️

### الواجهة الأمامية:
- React.js
- TypeScript
- Tailwind CSS
- Vite

### الخادم الخلفي:
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)

---

## المساهمة 🤝
نرحب بمساهماتكم! يرجى قراءة دليل المساهمة قبل إرسال أي تعديلات.

## الترخيص 📄
هذا المشروع مرخص تحت [MIT License](LICENSE).