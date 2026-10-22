# 📦 Supply Chain Monitor - Back-End

نظام الواجهة الخلفية (Backend) الخاص بمنصة **Supply Chain Monitor / Marketplace** مبني باستخدام **Node.js** و **TypeScript** و **Express 5**، مع دعم لقواعد بيانات **PostgreSQL** عبر **Sequelize ORM**، ودعم واجهات **GraphQL** عبر **Apollo Server**.

يعتمد المشروع على بنية معمارية طبقية حديثة ومنظمة (**Layered Architecture / Clean Architecture**) لضمان قابلية التوسع والصيانة وسهولة الاختبار.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **بيئة التشغيل:** Node.js مع أداة `tsx` للتنفيذ المباشر لملفات TypeScript في بيئة التطوير.
- **لغة البرمجة:** TypeScript (Strict Mode).
- **إطار العمل للويب:** Express 5.
- **قاعدة البيانات و ORM:** PostgreSQL مع Sequelize ORM.
- **واجهة الاستعلامات:** GraphQL مع Apollo Server v5 (`@apollo/server`).
- **المصادقة والأمان:** JSON Web Tokens (JWT) وتشفير كلمات المرور عبر `bcrypt`.
- **التحقق من صحة البيانات (Validation):** Zod (v4).

---

## 📁 الهيكل العام للمشروع (Project Structure)

```text
Supply Chain Monitor-back-end/
├── .env                       # متغيرات البيئة
├── .gitignore                  # الملفات المستثناة من Git
├── package.json               # إعدادات الحزم والاعتماديات والسكربتات
├── tsconfig.json              # إعدادات مترجم TypeScript
├── src/
│   ├── app.ts                 # إعداد تطبيق Express والميدلويرز العامة
│   ├── server.ts              # نقطة البداية وتشغيل السيرفر وقاعدة البيانات و GraphQL
│   ├── db.ts                  # تهيئة الاتصال بقاعدة بيانات PostgreSQL
│   ├── config/
│   │   └── env.ts             # قراءة وفحص متغيرات البيئة بشكل آمن
│   ├── graphql/
│   │   └── schema.ts          # مخطط واستعلامات GraphQL
│   ├── middleware/
│   │   ├── auth.middleware.ts     # التحقق من مصادقة التوكن (JWT)
│   │   ├── error.middleware.ts    # معالجة الأخطاء المركزية
│   │   ├── validate.middleware.ts # التحقق من صحة الطلبات عبر Zod
│   │   ├── jwtverf.ts             # (ملف قديم تم استبداله بـ auth.middleware)
│   │   └── middleware.ts          # (ملف قديم تم استبداله بـ validate و error middlewares)
│   ├── models/
│   │   └── user.ts            # نموذج جدول المستخدمين (Sequelize Model)
│   └── modules/
│       └── auth/              # وحدة المصادقة وإدارة المستخدمين
│           ├── auth.controller.ts # معالجة طلبات واستجابات HTTP
│           ├── auth.service.ts    # منطق الأعمال (Business Logic)
│           ├── auth.repository.ts # الوصول لقاعدة البيانات وعمليات Sequelize
│           ├── auth.routes.ts     # تعريف مسارات الـ Endpoints
│           ├── auth.validation.ts # قواعد التحقق من المدخلات عبر Zod
│           ├── auth.types.ts      # تعريف الـ Enums والواجهات الأساسية
│           └── auth.dto.ts        # كائنات نقل البيانات (Input & Output DTOs)
```

---

## 📄 تفصيل الملفات وشرح دور كل ملف (File-by-File Guide)

### 1. ملفات الجذر والإعدادات (Root Configuration)

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `package.json` | يحتوي على بيانات المشروع، وتحديد السكربتات التشغيلية (`dev` عبر `tsx watch`، `build` عبر `tsc`، `start` عبر `tsx`)، وجميع مكتبات الـ Dependencies والـ DevDependencies. |
| `tsconfig.json` | ملف إعدادات مترجم TypeScript، يحدد الإصدارات المدعومة (`ES2022`, `Bundler`)، مسارات المخرجات (`./dist`)، وتفعيل فحص الأنماط الصارم (`strict: true`). |
| `.env` | يحتوي على الإعدادات الحساسة الخاصة بالبيئة محلياً (بيانات اتصال PostgreSQL مثل اسم المستخدم وكلمة المرور وقاعدة البيانات، ورقم المنفذ `PORT`، والـ `JWT_SECRET`). |
| `.gitignore` | يحدد الملفات والمجلدات التي لا يجب رفعها إلى مستودع Git مثل `node_modules` و `dist` وملفات البيئة `.env`. |

---

### 2. نواة الخادم والتطبيق (Core & Application Setup)

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `src/server.ts` | **نقطة الدخول الرئيسية للتطبيق (Entry Point):** يقوم بالاتصال بقاعدة البيانات، تشغيل تطبيق Express، دمج خادم Apollo Server لمسار GraphQL (`/graphql`)، وتشغيل السيرفر للإنصات على المنفذ المحدد. |
| `src/app.ts` | **مصنع تطبيق Express (`createApp`):** يقوم بإعداد الميدلويرز العامة (CORS, Express JSON Body Parser)، وتسجيل مسارات الـ REST API تحت البادئة `/api`، وإضافة مسار فحص الحالة السريع (`/health`)، وربط معالج الأخطاء المركزي. |
| `src/db.ts` | **تهيئة قاعدة البيانات:** يقوم بإنشاء اتصال Sequelize بقاعدة بيانات PostgreSQL باستخدام إعدادات البيئة، ويصدر دالة `connectDB()` لاختبار الاتصال ومزامنة الجداول (`sequelize.sync()`). |
| `src/config/env.ts` | **إدارة إعدادات البيئة:** يتحقق برمجياً من وجود المتغيرات الإلزامية مثل `JWT_SECRET` وبيانات قاعدة البيانات ويطلق خطأ واضح في حال غياب أي متغير، مع تصدير كائن `env` موحد وآمن لجميع أجزاء المشروع. |

---

### 3. واجهة GraphQL (`src/graphql/`)

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `src/graphql/schema.ts` | يحتوي على تعريفات المخطط (`typeDefs`) باستخدام `gql` ومحللات الاستعلامات (`resolvers`) المبدئية، ويتضمن استعلام `health` للتأكد من عمل الـ GraphQL بنجاح. |

---

### 4. البرمجيات الوسيطة (`src/middleware/`)

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `src/middleware/auth.middleware.ts` | ميدلوير حماية المسارات (`authenticateJWT`)، يستخرج الـ Token من ترويسة الطلب `Authorization: Bearer <token>` ويتحقق من صحته عبر JWT، ثم يحقن بيانات المستخدم في `req.user`. |
| `src/middleware/validate.middleware.ts` | ميدلوير عالي الرتبة (`validate(schema)`) يقبل أي Zod Schema ويفحص محتوى `req.body` قبل وصول الطلب للكنترولر، وفي حال وجود أخطاء يمررها فوراً لمعالج الأخطاء. |
| `src/middleware/error.middleware.ts` | معالج الأخطاء المركزي (`errorMiddleware`)، يتعامل باحترافية مع أخطاء التحقق القادمة من Zod ويرجع تفاصيل الحقول بحالة `400`، كما يعالج الأخطاء العامة ويرجع رسائل واضحة بأكواد الاستجابة المناسبة. |
| `src/middleware/jwtverf.ts` | *(ملف سابق/Legacy)* وظيفة سابقة لفحص التوكن، تم استبدال استخدامها في المسارات بـ `auth.middleware.ts`. |
| `src/middleware/middleware.ts` | *(ملف سابق/Legacy)* وظائف تحقق ومعالجة أخطاء سابقة، تم استبدال استخدامها بالنسخ المعيارية المنفصلة. |

---

### 5. نماذج قاعدة البيانات (`src/models/`)

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `src/models/user.ts` | نموذج جدول المستخدمين `User` في Sequelize: يحدد هيكل جدول `users` في قاعدة البيانات (الحقول: `id` كـ UUID، `name`، `email` فريد، `password` المشفرة، و `role` كـ Enum لأدوار المستخدمين). |

---

### 6. وحدة إدارة الحسابات والمصادقة (`src/modules/auth/`)

تتبع هذه الوحدة نمط التصميم الطبقي لفصل المهام بالكامل:

| الملف | الوظيفة والشرح |
| :--- | :--- |
| `src/modules/auth/auth.routes.ts` | يربط المسارات (Endpoints) بالميدلوير المناسب وطرق الكنترولر: مسار التسجيل `POST /auth/register`، مسار تسجيل الدخول `POST /auth/login`، ومسار ترقية الدور `PATCH /auth/updaterole`. |
| `src/modules/auth/auth.controller.ts` | **طبقة التحكم (Controller Layer):** تستقبل طلبات HTTP، وتمرر البيانات لطبقة الـ Service، ثم تعيد ردود JSON المناسبة برموز الحالة الصحيحة (200, 201, 400, 401, 404, 500). |
| `src/modules/auth/auth.service.ts` | **طبقة منطق العمليات (Service Layer):** تحتوي على المنطق التجاري: التحقق من عدم تكرار البريد، تشفير كلمات المرور باستخدام `bcrypt`، التحقق من بيانات الدخول وتوليد التوكن (JWT)، وتحديث دور المستخدم. |
| `src/modules/auth/auth.repository.ts` | **طبقة الوصول للبيانات (Repository Layer):** تعزل استعلامات قاعدة البيانات عن منطق الأعمال، وتوفر دوال جاهزة: `findByEmail`, `findById`, `create`, `updateRole`. |
| `src/modules/auth/auth.validation.ts` | قواعد التحقق باستخدام Zod: مخطط تسجيل الحساب `registerSchema`، مخطط الدخول `loginSchema`، ومخطط تحديث الدور `updateRoleSchema`. |
| `src/modules/auth/auth.types.ts` | يحتوي على تعريفات الـ Types و الـ Enums الأساسية، مثل أدوار المستخدمين `UserRole` (`CUSTOMER`, `MERCHANT`, `MANUFACTURER`, `LOGISTICS_PROVIDER`, `SUPER_ADMIN`). |
| `src/modules/auth/auth.dto.ts` | **كائنات نقل البيانات (DTOs):** تحدد بدقة واجهات البيانات المدخلة والمخرجة (`RegisterDto`, `LoginDto`, `UpdateRoleDto`, `UserResponseDto`, `LoginResponseDto`). |

---

## 🌐 نقاط النهاية المتوفرة (API Endpoints)

جميع مسارات REST تبدأ بـ `/api`:

### 1. المسارات العامة
- `GET /health`: فحص حالة السيرفر للتأكد من عمله.

### 2. المصادقة (`/api/auth`)
- `POST /api/auth/register`
  - **الوظيفة:** تسجيل مستخدم جديد.
  - **الحماية:** عام (يتطلب Body يطابق `registerSchema`).
  - **المدخلات:** `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login`
  - **الوظيفة:** تسجيل الدخول والحصول على JWT Token.
  - **الحماية:** عام (يتطلب Body يطابق `loginSchema`).
  - **المدخلات:** `{ "email": "...", "password": "..." }`
- `PATCH /api/auth/updaterole`
  - **الوظيفة:** تعديل دور مستخدم.
  - **الحماية:** يتطلب تسجيل دخول (`Authorization: Bearer <token>`).
  - **المدخلات:** `{ "email": "...", "role": "MERCHANT | MANUFACTURER | LOGISTICS_PROVIDER | ..." }`

### 3. مسار GraphQL
- `POST /graphql` (أو عبر المتصفح لفتح واجهة Apollo Sandbox):
  - يدعم استعلام الفحص:
    ```graphql
    query {
      health
    }
    ```

---

## 🚀 كيفية التثبيت والتشغيل (Getting Started)

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد متغيرات البيئة
تأكد من وجود ملف `.env` في المسار الرئيسي بالبيانات المناسبة لقاعدة بياناتك:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=your_password

JWT_SECRET=your_super_secret_jwt_key
```

### 3. تشغيل الخادم في بيئة التطوير (Development)
```bash
npm run dev
```

### 4. بناء المشروع للإنتاج (Build)
```bash
npm run build
npm start
```
