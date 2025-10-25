# 📚 คู่มือการสร้าง API Path ใน NestJS

## 🎯 โครงสร้างพื้นฐาน

### 1. Controller Decorator
```typescript
@Controller('concerts')  // Base path: http://localhost:3000/concerts
```

---

## 📍 HTTP Methods และการใช้งาน

### 1. **GET** - ดึงข้อมูล
```typescript
// ดึงทั้งหมด: GET /concerts
@Get()
async findAll() {
  return this.service.findAll();
}

// ดึงตาม ID: GET /concerts/123
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}

// ค้นหาด้วย Query: GET /concerts/search?name=rock
@Get('search')
async search(@Query('name') name: string) {
  return this.service.search(name);
}
```

### 2. **POST** - สร้างข้อมูลใหม่
```typescript
// สร้าง: POST /concerts
@Post()
async create(@Body() createDto: CreateConcertDto) {
  return this.service.create(createDto);
}

// สร้างแบบซ้อน: POST /concerts/123/reserve
@Post(':id/reserve')
async reserve(@Param('id') id: string, @Body() data: any) {
  return this.service.reserve(id, data);
}
```

### 3. **PUT** - อัปเดตทั้งหมด
```typescript
// PUT /concerts/123
@Put(':id')
async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  return this.service.update(id, updateDto);
}
```

### 4. **PATCH** - อัปเดตบางส่วน
```typescript
// PATCH /concerts/123
@Patch(':id')
async partialUpdate(@Param('id') id: string, @Body() data: any) {
  return this.service.partialUpdate(id, data);
}
```

### 5. **DELETE** - ลบข้อมูล
```typescript
// DELETE /concerts/123
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.service.remove(id);
}
```

---

## 🔧 Decorators สำคัญ

### 1. **@Param()** - รับค่าจาก URL Path
```typescript
// GET /concerts/123
@Get(':id')
findOne(@Param('id') id: string) { }

// GET /concerts/123/seats/5
@Get(':concertId/seats/:seatId')
findSeat(
  @Param('concertId') concertId: string,
  @Param('seatId') seatId: string
) { }
```

### 2. **@Query()** - รับค่าจาก Query String
```typescript
// GET /concerts?page=1&limit=10&sort=name
@Get()
findAll(
  @Query('page') page: number,
  @Query('limit') limit: number,
  @Query('sort') sort: string
) { }
```

### 3. **@Body()** - รับข้อมูลจาก Request Body
```typescript
// POST /concerts
@Post()
create(@Body() createDto: CreateConcertDto) { }

// รับเฉพาะบางฟิลด์
@Post()
create(@Body('concert_name') name: string) { }
```

### 4. **@Headers()** - รับ Headers
```typescript
@Get()
findAll(@Headers('authorization') auth: string) { }
```

---

## 🎨 ตัวอย่าง Path ที่ใช้บ่อย

### 1. CRUD พื้นฐาน
```typescript
GET    /concerts          → ดึงทั้งหมด
GET    /concerts/:id      → ดึงตาม ID
POST   /concerts          → สร้างใหม่
PUT    /concerts/:id      → อัปเดตทั้งหมด
PATCH  /concerts/:id      → อัปเดตบางส่วน
DELETE /concerts/:id      → ลบ
```

### 2. Nested Routes (Path ซ้อน)
```typescript
GET    /concerts/:id/seats              → ดึงที่นั่งทั้งหมดของคอนเสิร์ต
POST   /concerts/:id/seats              → สร้างที่นั่งใหม่
POST   /concerts/:id/reserve            → จองคอนเสิร์ต
GET    /concerts/:id/history            → ดูประวัติคอนเสิร์ต
```

### 3. Search & Filter
```typescript
GET /concerts/search?name=rock&date=2024-01-01
GET /concerts?category=music&status=active
GET /concerts/filter?minPrice=100&maxPrice=500
```

---

## 🚀 ตัวอย่างการใช้งานจริง

### Controller เต็มรูปแบบ
```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query 
} from '@nestjs/common';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly service: ConcertsService) {}

  // GET /concerts
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(page, limit);
  }

  // GET /concerts/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // POST /concerts
  @Post()
  create(@Body() createDto: CreateConcertDto) {
    return this.service.create(createDto);
  }

  // PUT /concerts/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.service.update(id, updateDto);
  }

  // DELETE /concerts/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

---

## 💡 Tips & Best Practices

### 1. **ลำดับของ Routes สำคัญ!**
```typescript
// ✅ ถูกต้อง
@Get('search')    // ต้องมาก่อน
@Get(':id')       // ตัวนี้ทีหลัง

// ❌ ผิด - :id จะจับ 'search' ไปด้วย
@Get(':id')
@Get('search')
```

### 2. **ใช้ DTO สำหรับ Type Safety**
```typescript
// สร้าง DTO
export class CreateConcertDto {
  concert_name: string;
  seat: number;
  description: string;
}

// ใช้งาน
@Post()
create(@Body() dto: CreateConcertDto) { }
```

### 3. **Validation ด้วย class-validator**
```typescript
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  concert_name: string;

  @IsNumber()
  seat: number;
}
```

### 4. **Response Status Code**
```typescript
import { HttpCode, HttpStatus } from '@nestjs/common';

@Post()
@HttpCode(HttpStatus.CREATED)  // 201
create(@Body() dto: CreateConcertDto) { }

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)  // 204
remove(@Param('id') id: string) { }
```

---

## 🧪 ทดสอบ API

### ใช้ Thunder Client, Postman หรือ curl:

```bash
# GET - ดึงทั้งหมด
curl http://localhost:3000/concerts

# GET - ดึงตาม ID
curl http://localhost:3000/concerts/1

# POST - สร้างใหม่
curl -X POST http://localhost:3000/concerts \
  -H "Content-Type: application/json" \
  -d '{
    "concert_name": "Rock Concert",
    "seat": 100,
    "description": "Amazing concert"
  }'

# PUT - อัปเดต
curl -X PUT http://localhost:3000/concerts/1 \
  -H "Content-Type: application/json" \
  -d '{"concert_name": "Updated Name"}'

# DELETE - ลบ
curl -X DELETE http://localhost:3000/concerts/1
```

---

## 📦 โครงสร้างไฟล์ที่แนะนำ

```
src/
└── concerts/
    ├── concerts.controller.ts    # กำหนด paths
    ├── concerts.service.ts       # Business logic
    ├── concerts.module.ts        # Module config
    └── dto/
        ├── create-concert.dto.ts
        └── update-concert.dto.ts
```

---

## 🎓 สรุป

1. **@Controller('path')** - กำหนด base path
2. **@Get(), @Post(), @Put(), @Delete()** - HTTP methods
3. **@Param()** - รับค่าจาก URL
4. **@Query()** - รับค่าจาก query string
5. **@Body()** - รับข้อมูลจาก request body
6. **ลำดับ routes สำคัญ** - static routes ต้องมาก่อน dynamic routes
7. **ใช้ DTO** เพื่อความปลอดภัยและชัดเจน

---

Happy Coding! 🚀
