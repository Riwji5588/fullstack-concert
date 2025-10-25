# 🔧 คู่มือแก้ปัญหา CORS

## ❌ ปัญหาที่พบ

```
Access to XMLHttpRequest at 'http://localhost:3001/concerts/create' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ วิธีแก้ไข

### 1. เปิด CORS ใน Backend (NestJS)

**ไฟล์: `backend/src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',        // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

### 2. แก้ไข API Path ให้ตรงกัน

**Backend Controller:**
```typescript
@Controller('concerts')
export class ConcertsController {
  @Post()  // ไม่ใช่ @Post('create')
  async create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }
}
```

**Frontend:**
```typescript
await axios.post(API_ENDPOINTS.concerts.base, {
  concert_name: form.concertName,
  seat: form.seats,
  description: form.description
});
```

---

## 🎯 CORS Configuration Options

### แบบพื้นฐาน (อนุญาตเฉพาะ localhost:3000)
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### แบบหลาย Origins
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://yourdomain.com'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### แบบอนุญาตทั้งหมด (ใช้ในการ Dev เท่านั้น!)
```typescript
app.enableCors({
  origin: '*',  // อนุญาตทุก domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});
```

### แบบ Dynamic (ตรวจสอบ origin)
```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://production.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

---

## 🔍 ตัวเลือก CORS ทั้งหมด

```typescript
app.enableCors({
  origin: 'http://localhost:3000',       // URL ที่อนุญาต
  methods: 'GET,POST,PUT,DELETE,PATCH',  // HTTP methods ที่อนุญาต
  allowedHeaders: 'Content-Type,Authorization',  // Headers ที่อนุญาต
  exposedHeaders: 'X-Total-Count',       // Headers ที่จะส่งกลับ
  credentials: true,                      // อนุญาต cookies/auth headers
  maxAge: 3600,                          // cache preflight request (วินาที)
  preflightContinue: false,              // ส่งต่อ preflight ไปยัง route handler
  optionsSuccessStatus: 204,             // status code สำหรับ OPTIONS request
});
```

---

## 🌍 Environment-based CORS

### สร้างไฟล์ `.env`
```env
# Development
FRONTEND_URL=http://localhost:3000

# Production
# FRONTEND_URL=https://yourdomain.com
```

### ใช้ใน main.ts
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
```

---

## 🛡️ Production Best Practices

### 1. ✅ ระบุ Origin ชัดเจน
```typescript
// ❌ อย่าทำแบบนี้ใน Production
app.enableCors({ origin: '*' });

// ✅ ทำแบบนี้
app.enableCors({ 
  origin: 'https://yourdomain.com',
  credentials: true 
});
```

### 2. ✅ จำกัด Methods
```typescript
app.enableCors({
  origin: 'https://yourdomain.com',
  methods: 'GET,POST,PUT,DELETE',  // เฉพาะที่ใช้จริง
});
```

### 3. ✅ ใช้ Environment Variables
```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
});
```

---

## 🧪 ทดสอบ CORS

### 1. ใช้ Browser DevTools
```javascript
// เปิด Console ใน Browser
fetch('http://localhost:3001/concerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    concert_name: 'Test',
    seat: 100,
    description: 'Test'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### 2. ใช้ curl
```bash
curl -X POST http://localhost:3001/concerts \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{
    "concert_name": "Test Concert",
    "seat": 100,
    "description": "Test"
  }' \
  -v
```

### 3. ตรวจสอบ Response Headers
ควรเห็น headers เหล่านี้:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Credentials: true
```

---

## 📋 Checklist แก้ปัญหา CORS

- [x] เปิด CORS ใน `main.ts`
- [x] ระบุ `origin` ที่ถูกต้อง
- [x] ตั้งค่า `credentials: true` (ถ้าใช้ cookies/auth)
- [x] ตรวจสอบ API path ให้ตรงกันระหว่าง frontend/backend
- [x] Restart backend server หลังแก้ไข
- [x] Clear browser cache
- [x] ตรวจสอบ Network tab ใน DevTools

---

## 🚨 Error Messages ที่พบบ่อย

### 1. "No 'Access-Control-Allow-Origin' header"
**สาเหตุ:** ไม่ได้เปิด CORS หรือ origin ไม่ตรง  
**แก้ไข:** เพิ่ม `app.enableCors()` ใน main.ts

### 2. "Preflight request doesn't pass"
**สาเหตุ:** Browser ส่ง OPTIONS request ก่อน แต่ backend ไม่ตอบ  
**แก้ไข:** ตรวจสอบว่า methods รวม OPTIONS หรือไม่

### 3. "Credentials flag is true, but origin is '*'"
**สาเหตุ:** ใช้ `credentials: true` กับ `origin: '*'` พร้อมกัน  
**แก้ไข:** ระบุ origin ชัดเจนแทน `*`

---

## 🔄 Restart Backend

หลังแก้ไขไฟล์ `main.ts` ต้อง restart:

```bash
# หยุด server (Ctrl + C)
# รันใหม่
npm run start:dev
```

---

## 📚 สรุป

1. ✅ เปิด CORS ใน `main.ts` ด้วย `app.enableCors()`
2. ✅ ระบุ `origin` เป็น frontend URL
3. ✅ ตั้งค่า `credentials: true` ถ้าใช้ authentication
4. ✅ แก้ API path ให้ตรงกัน (ใช้ `@Post()` แทน `@Post('create')`)
5. ✅ Restart backend server
6. ✅ Test ใน browser

---

Happy Coding! 🚀
