> ⚠️ **توجه:** نسخه اصلی پروژه به زبان جاوااسکریپت است. نسخه TypeScript پروژه در یک برنچ جداگانه قرار دارد و در صورت تمایل می‌توانید آن را بررسی کنید.

# سیستم مدیریت وقت ملاقات (Appointment System)

یک پروژه تمرینی **Node.js + Express + MongoDB** با ساختار ماژولار و رعایت اصول حرفه‌ای که شامل مدیریت کاربران، خدمات (Service) و وقت ملاقات‌ها می‌شود. پروژه به‌صورت REST API طراحی شده و امکاناتی مانند احراز هویت، سطح دسترسی، آپلود فایل، اعتبارسنجی ورودی و ایمیل اطلاع‌رسانی دارد.

---

## تکنولوژی‌ها و ابزارها

- Node.js + Express
- MongoDB + Mongoose
- TypeScript (در برنچ جدا)
- express-validator برای اعتبارسنجی
- Multer برای آپلود فایل‌ها
- JWT برای احراز هویت
- Nodemailer برای ارسال ایمیل
- dotenv برای مدیریت متغیرهای محیطی
- Jest و Supertest برای تست (در پوشه `tests`)
- VS Code و ترمینال برای توسعه

---

## ساختار پروژه

appointment-system/
├─ src/
│ ├─ models/
│ │ ├─ Appointment.ts
│ │ ├─ Service.ts
│ │ ├─ User.ts
│ ├─ controllers/
│ │ ├─ adminController.ts
│ │ ├─ appointmentController.ts
│ │ ├─ authController.ts
│ │ ├─ serviceController.ts
│ │ ├─ userController.ts
│ ├─ routes/
│ │ ├─ adminRoutes.ts
│ │ ├─ appointmentRoutes.ts
│ │ ├─ authRoutes.ts
│ │ ├─ serviceRoutes.ts
│ │ ├─ userRoutes.ts
│ ├─ middleware/
│ │ ├─ validations/
│ │ │ ├─ adminValidator.ts
│ │ │ ├─ appointmentValidator.ts
│ │ │ ├─ authValidator.ts
│ │ │ ├─ serviceValidator.ts
│ │ │ ├─ validateResult.ts
│ │ ├─ authMiddleware.ts
│ │ ├─ authorize.ts
│ │ ├─ errorMiddleware.ts
│ │ ├─ upload.ts
│ │ ├─ uploadMiddleware.ts
│ ├─ utils/
│ │ ├─ emailTemplates/
│ │ │ ├─ generateAppointmentEmail.js
│ │ │ ├─ generateAppointmentStatusEmail.js
│ │ │ ├─ resendVerificationEmail.js
│ │ │ ├─ resetPasswordEmail.js
│ │ │ ├─ verificationEmail.js
│ │ ├─ sendEmail.ts
│ │ ├─ token.ts
│ ├─ config/
│ │ ├─ db.ts
│ ├─ types/
│ ├─ express/
│ │ ├─ index.d.ts
│ ├─ tests/
│ │ ├─ auth.login.test.js
│ │ ├─ auth.logout.test.js
│ │ ├─ auth.refresh.test.js
│ │ ├─ jest.setup.js
│ │ ├─ user.profile.test.js
│ ├─ app.ts
│ └─ server.ts
├─ uploads/
├─ package.json
├─ package-lock.json
├─ .env
├─ .env.test
├─ tsconfig.json
├─ tsconfig.tsbuildinfo
├─ dist/
├─ node_modules/
└─ .gitignore


---

##  تکنولوژی‌ها و ابزارها

- **Node.js**  
- **Express.js**  
- **MongoDB + Mongoose**  
- **TypeScript**  
- **JWT (JSON Web Token)** برای احراز هویت  
- **bcrypt** برای هش کردن پسوردها  
- **Multer** برای آپلود فایل  
- **Express Validator** برای اعتبارسنجی ورودی‌ها  
- **Nodemailer** برای ارسال ایمیل  
- **Jest + Supertest** برای تست API  

---

##  قابلیت‌ها

### کاربران (Users)
- ثبت نام و ورود با ایمیل و پسورد  
- تایید ایمیل بعد از ثبت نام  
- بازیابی و ریست پسورد  
- دریافت پروفایل  
- آپلود آواتار  

### سرویس‌ها (Services)
- CRUD کامل سرویس‌ها (Create, Read, Update, Delete)  
- فقط ادمین قادر به ایجاد، ویرایش و حذف سرویس‌هاست  
- امکان آپلود تصویر برای سرویس‌ها  

### نوبت‌ها (Appointments)
- کاربران می‌توانند نوبت رزرو کنند  
- نمایش نوبت‌های خود  
- لغو نوبت  
- ادمین قادر است وضعیت نوبت را تغییر دهد  
- فیلتر نوبت‌ها بر اساس تاریخ، وضعیت، کاربر و سرویس  
- نمایش آخرین نوبت‌ها و آمار داشبورد  

### احراز هویت و دسترسی
- JWT برای لاگین و محافظت از مسیرها  
- Middleware برای نقش‌ها: `user` و `admin`  
- اعتبارسنجی ورودی‌ها با Express Validator  
- مدیریت آپلود فایل امن با Multer و حذف فایل نامعتبر  

### ایمیل‌ها
- تایید ایمیل بعد از ثبت نام  
- ارسال ایمیل برای بازیابی پسورد  
- ارسال تایید رزرو نوبت و تغییر وضعیت نوبت  

---

##  نمونه مسیرهای API

| Method | Route | دسترسی | توضیح |
|--------|-------|--------|-------|
| POST | `/api/auth/register` | Public | ثبت نام کاربر |
| POST | `/api/auth/login` | Public | لاگین کاربر |
| GET | `/api/auth/verify-email/:token` | Public | تایید ایمیل |
| POST | `/api/auth/forgot-password` | Public | درخواست ریست پسورد |
| POST | `/api/auth/reset-password/:token` | Public | ریست پسورد |
| GET | `/api/user/me` | Auth | دریافت پروفایل |
| PATCH | `/api/user/avatar` | Auth | آپلود آواتار |
| GET | `/api/services` | Public | لیست سرویس‌ها |
| POST | `/api/services` | Admin | ایجاد سرویس |
| GET | `/api/services/:id` | Public | جزئیات سرویس |
| PUT | `/api/services/:id` | Admin | ویرایش سرویس |
| DELETE | `/api/services/:id` | Admin | حذف سرویس |
| POST | `/api/appointments` | Auth | رزرو نوبت |
| GET | `/api/appointments/me` | Auth | مشاهده نوبت‌های خود |
| DELETE | `/api/appointments/:id` | Auth | لغو نوبت |
| GET | `/api/appointments` | Admin | مشاهده تمام نوبت‌ها |
| PATCH | `/api/appointments/:id/status` | Admin | تغییر وضعیت نوبت |
| GET | `/api/admin/dashboard-status` | Admin | آمار داشبورد |

---

##  نصب و اجرا

1. کلون پروژه:

```bash
git clone <repo_url>
cd appointment-system

2.نصب و وابستگی ها:
npm install

3.ایجاد فایل .env:
PORT=5000
MONGO_URI=mongodb://localhost:27017/appointment-system
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=email_password

4.اجرای پروژه (برای توسعه):
npm run dev

5.اجرای تست ها:
npm test

نکات مهم

فایل‌های آپلود شده در پوشه uploads/ ذخیره می‌شوند

تمامی مسیرهای حساس با JWT محافظت شده‌اند

ادمین نقش ویژه دارد و فقط به مسیرهای مدیریتی دسترسی دارد

خطاهای اعتبارسنجی و فایل‌ها به صورت خودکار هندل می‌شوند

تست‌ها

تست‌های موجود در پوشه tests/ شامل تست‌های لاگین، پروفایل، refresh token و logout هستند

Jest و Supertest برای تست API استفاده شده است

جمع‌بندی

این پروژه یک سیستم مدیریت نوبت حرفه‌ای است که تمام اصول REST API، احراز هویت، مدیریت نقش‌ها، اعتبارسنجی، آپلود فایل و ارسال ایمیل را پیاده‌سازی کرده است.
ساختار پروژه ماژولار است و توسعه و افزودن ویژگی‌های جدید ساده و سریع است.
