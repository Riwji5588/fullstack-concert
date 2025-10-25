# 🔐 การใช้งาน Environment Variables (.env)

## 📁 ไฟล์ที่สร้างแล้ว

### 1. `.env.example` 
- Template สำหรับการตั้งค่า
- ควร commit ขึ้น Git
- ใช้เป็นตัวอย่างสำหรับ developer คนอื่น

### 2. `.env.local`
- ไฟล์สำหรับ development ในเครื่องของคุณ
- **ห้าม commit ขึ้น Git!** (อยู่ใน .gitignore แล้ว)
- ค่าที่ตั้งไว้จะ override `.env`

### 3. `.env`
- ค่า default สำหรับทุก environment
- บางทีอาจ commit ได้ (ถ้าไม่มีข้อมูลสำคัญ)

---

## 🔑 ตัวแปรที่มีอยู่

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### ⚠️ สำคัญ!
- ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` จะถูกส่งไปที่ browser (client-side)
- ตัวแปรที่ไม่มี `NEXT_PUBLIC_` จะใช้ได้แค่ใน server-side เท่านั้น

---

## 📖 การใช้งาน

### 1. ใช้โดยตรงใน Component
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(apiUrl); // http://localhost:3001
```

### 2. ใช้ผ่าน Helper (แนะนำ ✅)
```typescript
import { API_ENDPOINTS } from '@/lib/api';

// ใช้งาน endpoints ที่กำหนดไว้แล้ว
const response = await fetch(API_ENDPOINTS.concerts.base);

// ค้นหา
const searchResults = await fetch(API_ENDPOINTS.concerts.search('rock'));

// ดึงตาม ID
const concert = await fetch(API_ENDPOINTS.concerts.byId(1));

// จองที่นั่ง
await fetch(API_ENDPOINTS.concerts.reserve(1), {
  method: 'POST',
  body: JSON.stringify({ seats: 2 })
});
```

### 3. ใช้กับ Axios
```typescript
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/api';

// POST - สร้างคอนเสิร์ต
await axios.post(API_ENDPOINTS.concerts.base, {
  concert_name: 'Rock Concert',
  seat: 100,
  description: 'Amazing concert'
});

// GET - ดึงทั้งหมด
const { data } = await axios.get(API_ENDPOINTS.concerts.base);

// PUT - อัปเดต
await axios.put(API_ENDPOINTS.concerts.byId(1), {
  concert_name: 'Updated Name'
});

// DELETE - ลบ
await axios.delete(API_ENDPOINTS.concerts.byId(1));
```

---

## 🛠️ API Helper Functions

### ใช้ `fetchAPI` helper
```typescript
import { fetchAPI, API_ENDPOINTS } from '@/lib/api';

// GET
const concerts = await fetchAPI(API_ENDPOINTS.concerts.base);

// POST
const newConcert = await fetchAPI(API_ENDPOINTS.concerts.base, {
  method: 'POST',
  body: JSON.stringify({
    concert_name: 'Rock Concert',
    seat: 100,
    description: 'Amazing'
  })
});

// PUT
const updated = await fetchAPI(API_ENDPOINTS.concerts.byId(1), {
  method: 'PUT',
  body: JSON.stringify({ concert_name: 'Updated' })
});

// DELETE
await fetchAPI(API_ENDPOINTS.concerts.byId(1), {
  method: 'DELETE'
});
```

---

## 🌍 Environment ต่างๆ

### Development (Local)
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Production
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

### Staging
```env
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.yourapp.com
```

---

## 📋 API Endpoints ที่มีอยู่

```typescript
API_ENDPOINTS.concerts.base              // /concerts
API_ENDPOINTS.concerts.search(name)      // /concerts/search?name=xxx
API_ENDPOINTS.concerts.available         // /concerts/available
API_ENDPOINTS.concerts.count             // /concerts/count
API_ENDPOINTS.concerts.byId(id)          // /concerts/:id
API_ENDPOINTS.concerts.reserve(id)       // /concerts/:id/reserve
```

---

## 💡 ตัวอย่างการใช้งานจริง

### ใน Admin Page - Create Concert
```typescript
import { API_ENDPOINTS } from '@/lib/api';
import axios from 'axios';

const handleCreateConcert = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await axios.post(API_ENDPOINTS.concerts.base, {
      concert_name: form.concertName,
      seat: form.seats,
      description: form.description
    });
    
    alert('Concert created successfully!');
    resetForm();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create concert');
  }
};
```

### ใน User Page - ดึงข้อมูลคอนเสิร์ต
```typescript
import { useEffect, useState } from 'react';
import { fetchAPI, API_ENDPOINTS } from '@/lib/api';

export default function UserPage() {
  const [concerts, setConcerts] = useState([]);
  
  useEffect(() => {
    const loadConcerts = async () => {
      try {
        const data = await fetchAPI(API_ENDPOINTS.concerts.base);
        setConcerts(data);
      } catch (error) {
        console.error('Error loading concerts:', error);
      }
    };
    
    loadConcerts();
  }, []);
  
  return (
    <div>
      {concerts.map(concert => (
        <div key={concert.id}>{concert.concertName}</div>
      ))}
    </div>
  );
}
```

### จองที่นั่ง
```typescript
const handleReserve = async (concertId: number, seats: number) => {
  try {
    await axios.post(API_ENDPOINTS.concerts.reserve(concertId), {
      seats: seats
    });
    
    alert('Reserved successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to reserve');
  }
};
```

---

## 🔒 Security Best Practices

### ✅ ควรทำ
- ใช้ `NEXT_PUBLIC_` สำหรับตัวแปรที่ใช้ใน client-side
- เก็บ API keys ที่สำคัญใน `.env.local` (server-side only)
- เพิ่ม `.env.local` ใน `.gitignore`
- สร้าง `.env.example` เป็น template

### ❌ ไม่ควรทำ
- ห้าม commit `.env.local` ขึ้น Git
- ห้ามใส่ API keys ที่สำคัญในตัวแปร `NEXT_PUBLIC_`
- ห้าม hardcode URLs ในโค้ด

---

## 🔄 Restart Server

หลังจากแก้ไข `.env` ต้อง **restart development server**:

```bash
# หยุด server (Ctrl + C)
# จากนั้นรันใหม่
npm run dev
```

---

## 📦 ไฟล์โครงสร้าง

```
frontend/
├── .env                 # Default values
├── .env.local          # Local development (ไม่ commit)
├── .env.example        # Template (commit ได้)
├── lib/
│   └── api.ts          # API helper functions
└── app/
    └── admin/
        └── page.tsx    # ใช้ API_ENDPOINTS
```

---

## 🎯 สรุป

1. ✅ ใช้ `NEXT_PUBLIC_API_URL` สำหรับ API URL
2. ✅ Import `API_ENDPOINTS` จาก `@/lib/api`
3. ✅ ใช้ `fetchAPI` หรือ `axios` ในการเรียก API
4. ✅ Restart server หลังแก้ไข `.env`
5. ✅ ห้าม commit `.env.local`

---

Happy Coding! 🚀
