# 🌐 Server Monitoring

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.11.0-brightgreen.svg)

[English](#english) | [العربية](#arabic)

</div>

---

<a name="english"></a>
# 🇬🇧 English

## 📋 Project Overview
Ping Checker is a modern web application designed for real-time server monitoring. It provides users with a robust platform to track server status, manage uptime monitoring, and receive instant notifications for any connectivity issues.

### 🌟 Key Features
- **Real-time Monitoring**
  - Instant server status updates
  - Customizable ping intervals
  - Detailed uptime statistics

- **User Management**
  - Secure authentication system
  - Profile customization
  - Role-based access control

- **Notification System**
  - Email alerts for server downtime
  - Customizable notification settings
  - Status history tracking

- **Modern UI/UX**
  - Responsive design
  - Dark/Light theme support
  - Interactive dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v22.11.0 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/LeXarDev/Server-Monitoring]
   cd project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432

   # Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173

   # Auth Configuration
   JWT_SECRET=your-jwt-secret
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL service
   # Then run database setup
   npm run setup-db
   ```

5. **Start the Application**
   ```bash
   # Development mode
   npm run dev:all

   # Production mode
   npm run build && npm start
   ```

## 🏗️ Project Structure

```
project/
├── components/          # React components
├── contexts/           # React contexts
├── services/          # API services
├── utils/             # Utility functions
├── types/             # TypeScript types
├── public/            # Static assets
└── server/            # Backend server code
```

## 🛠️ Technology Stack

### Frontend
- **Core**: React.js with TypeScript
- **Styling**: Tailwind CSS, Material-UI
- **State Management**: React Context
- **Build Tool**: Vite
- **Authentication**: Auth0

### Backend
- **Server**: Node.js, Express.js
- **Database**: PostgreSQL
- **Security**: JWT, Helmet
- **File Upload**: Multer
- **Logging**: Winston

## 🔒 Security Features
- CORS protection
- Rate limiting
- XSS prevention
- CSRF protection
- Secure file upload
- Password hashing
- JWT authentication


## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="arabic"></a>
# 🇸🇦 العربية

## 📋 نظرة عامة على المشروع
فاحص البينج هو تطبيق ويب حديث مصمم لمراقبة الخوادم في الوقت الفعلي. يوفر للمستخدمين منصة قوية لتتبع حالة الخادم، وإدارة مراقبة الجاهزية، وتلقي إشعارات فورية لأي مشاكل في الاتصال.

### 🌟 الميزات الرئيسية
- **المراقبة في الوقت الفعلي**
  - تحديثات فورية لحالة الخادم
  - فترات بينج قابلة للتخصيص
  - إحصائيات تفصيلية للجاهزية

- **إدارة المستخدمين**
  - نظام مصادقة آمن
  - تخصيص الملف الشخصي
  - التحكم في الوصول القائم على الأدوار

- **نظام الإشعارات**
  - تنبيهات البريد الإلكتروني لتوقف الخادم
  - إعدادات إشعارات قابلة للتخصيص
  - تتبع سجل الحالة

- **واجهة مستخدم حديثة**
  - تصميم متجاوب
  - دعم السمة الداكنة/الفاتحة
  - لوحة تحكم تفاعلية

## 🚀 البدء

### المتطلبات الأساسية
- Node.js (الإصدار 22.11.0 أو أحدث)
- PostgreSQL (الإصدار 14 أو أحدث)
- npm أو yarn كمدير للحزم

### خطوات التثبيت

1. **استنساخ المستودع**
   ```bash
   git clone [https://github.com/LeXarDev/Server-Monitoring]
   cd project
   ```

2. **تثبيت الاعتماديات**
   ```bash
   npm install
   ```

3. **تكوين البيئة**
   قم بإنشاء ملف `.env` في المجلد الرئيسي:
   ```env
   # إعدادات قاعدة البيانات
   DB_USER=اسم_مستخدم_قاعدة_البيانات
   DB_HOST=مضيف_قاعدة_البيانات
   DB_NAME=اسم_قاعدة_البيانات
   DB_PASSWORD=كلمة_مرور_قاعدة_البيانات
   DB_PORT=5432

   # إعدادات الخادم
   PORT=3001
   FRONTEND_URL=http://localhost:5173

   # إعدادات المصادقة
   JWT_SECRET=مفتاح-jwt-الخاص-بك
   ```

4. **إعداد قاعدة البيانات**
   ```bash
   # تشغيل خدمة PostgreSQL
   # ثم تشغيل إعداد قاعدة البيانات
   npm run setup-db
   ```

5. **تشغيل التطبيق**
   ```bash
   # وضع التطوير
   npm run dev:all

   # وضع الإنتاج
   npm run build && npm start
   ```

## 🏗️ هيكل المشروع

```
project/
├── components/          # مكونات React
├── contexts/           # سياقات React
├── services/          # خدمات API
├── utils/             # وظائف مساعدة
├── types/             # أنواع TypeScript
├── public/            # الأصول الثابتة
└── server/            # كود الخادم الخلفي
```

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية
- **الأساس**: React.js مع TypeScript
- **التنسيق**: Tailwind CSS, Material-UI
- **إدارة الحالة**: React Context
- **أداة البناء**: Vite
- **المصادقة**: Auth0

### الخادم الخلفي
- **الخادم**: Node.js, Express.js
- **قاعدة البيانات**: PostgreSQL
- **الأمان**: JWT, Helmet
- **رفع الملفات**: Multer
- **التسجيل**: Winston

## 🔒 ميزات الأمان
- حماية CORS
- تحديد معدل الطلبات
- منع XSS
- حماية CSRF
- رفع ملفات آمن
- تشفير كلمات المرور
- مصادقة JWT


## 📄 الترخيص
هذا المشروع مرخص بموجب رخصة MIT - راجع ملف [LICENSE](LICENSE) للحصول على التفاصيل.

---

<div align="center">

Made with ❤️ in Saudi Arabia | صُنع بحب في المملكة العربية السعودية 🇸🇦

</div>
