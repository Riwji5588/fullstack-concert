# 🛠️ คู่มือการสร้างหลายๆ Service Methods

## 📚 โครงสร้างพื้นฐาน

Service คือที่ที่เก็บ **Business Logic** ทั้งหมด ไม่ว่าจะเป็น:
- การดึงข้อมูลจาก Database
- การคำนวณ
- การตรวจสอบเงื่อนไข
- การเรียก API ภายนอก

---

## 🎯 Service Methods ที่ควรมี (CRUD + Extra)

### 1. **CREATE** - สร้างข้อมูล
```typescript
async create(createDto: CreateConcertDto) {
  return this.prisma.concertEvent.create({
    data: {
      concertName: createDto.concert_name,
      seat: createDto.seat,
      description: createDto.description,
      seatReserve: 0,
    },
  });
}
```

### 2. **READ** - อ่านข้อมูล

#### 2.1 ดึงทั้งหมด
```typescript
async findAll() {
  return this.prisma.concertEvent.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
```

#### 2.2 ดึงตาม ID
```typescript
async findOne(id: number) {
  const concert = await this.prisma.concertEvent.findUnique({
    where: { id },
  });

  if (!concert) {
    throw new NotFoundException(`ไม่พบคอนเสิร์ต ID: ${id}`);
  }

  return concert;
}
```

#### 2.3 ค้นหา (Search)
```typescript
async search(name: string) {
  return this.prisma.concertEvent.findMany({
    where: {
      concertName: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });
}
```

### 3. **UPDATE** - อัปเดตข้อมูล
```typescript
async update(id: number, updateData: Partial<CreateConcertDto>) {
  await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง

  return this.prisma.concertEvent.update({
    where: { id },
    data: {
      ...(updateData.concert_name && { concertName: updateData.concert_name }),
      ...(updateData.seat && { seat: updateData.seat }),
      ...(updateData.description && { description: updateData.description }),
    },
  });
}
```

### 4. **DELETE** - ลบข้อมูล
```typescript
async remove(id: number) {
  await this.findOne(id); // ตรวจสอบว่ามีอยู่จริง

  return this.prisma.concertEvent.delete({
    where: { id },
  });
}
```

---

## 🚀 Service Methods เพิ่มเติม (Business Logic)

### 1. **Count** - นับจำนวน
```typescript
async count() {
  return this.prisma.concertEvent.count();
}

// นับแบบมีเงื่อนไข
async countAvailable() {
  return this.prisma.concertEvent.count({
    where: {
      seat: { gt: this.prisma.concertEvent.fields.seatReserve },
    },
  });
}
```

### 2. **Filter** - กรองข้อมูล
```typescript
async getAvailableConcerts() {
  return this.prisma.concertEvent.findMany({
    where: {
      seat: { gt: this.prisma.concertEvent.fields.seatReserve },
    },
  });
}

// กรองตามหลายเงื่อนไข
async filterConcerts(filters: {
  minSeat?: number;
  maxSeat?: number;
  available?: boolean;
}) {
  return this.prisma.concertEvent.findMany({
    where: {
      ...(filters.minSeat && { seat: { gte: filters.minSeat } }),
      ...(filters.maxSeat && { seat: { lte: filters.maxSeat } }),
      ...(filters.available && {
        seat: { gt: this.prisma.concertEvent.fields.seatReserve },
      }),
    },
  });
}
```

### 3. **Pagination** - แบ่งหน้า
```typescript
async findAllPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.concertEvent.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.concertEvent.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 4. **Sorting** - เรียงลำดับ
```typescript
async findAllSorted(sortBy: string = 'createdAt', order: 'asc' | 'desc' = 'desc') {
  return this.prisma.concertEvent.findMany({
    orderBy: {
      [sortBy]: order,
    },
  });
}
```

### 5. **Business Logic** - ตรรกะเฉพาะ
```typescript
// จองที่นั่ง
async reserveSeat(id: number, seats: number) {
  const concert = await this.findOne(id);

  const availableSeats = concert.seat - concert.seatReserve;
  if (availableSeats < seats) {
    throw new Error(`ที่นั่งไม่พอ! เหลือเพียง ${availableSeats} ที่นั่ง`);
  }

  return this.prisma.concertEvent.update({
    where: { id },
    data: {
      seatReserve: concert.seatReserve + seats,
    },
  });
}

// ยกเลิกการจอง
async cancelReservation(id: number, seats: number) {
  const concert = await this.findOne(id);

  if (concert.seatReserve < seats) {
    throw new Error('ไม่สามารถยกเลิกได้ เกินจำนวนที่จอง');
  }

  return this.prisma.concertEvent.update({
    where: { id },
    data: {
      seatReserve: concert.seatReserve - seats,
    },
  });
}
```

### 6. **Aggregate** - สถิติ
```typescript
async getStatistics() {
  const [total, totalSeats, totalReserved] = await Promise.all([
    this.prisma.concertEvent.count(),
    this.prisma.concertEvent.aggregate({
      _sum: { seat: true },
    }),
    this.prisma.concertEvent.aggregate({
      _sum: { seatReserve: true },
    }),
  ]);

  return {
    totalConcerts: total,
    totalSeats: totalSeats._sum.seat || 0,
    totalReserved: totalReserved._sum.seatReserve || 0,
    availableSeats: (totalSeats._sum.seat || 0) - (totalReserved._sum.seatReserve || 0),
  };
}
```

### 7. **Bulk Operations** - จัดการหลายรายการ
```typescript
// สร้างหลายรายการพร้อมกัน
async createMany(concerts: CreateConcertDto[]) {
  return this.prisma.concertEvent.createMany({
    data: concerts.map(c => ({
      concertName: c.concert_name,
      seat: c.seat,
      description: c.description,
      seatReserve: 0,
    })),
  });
}

// ลบหลายรายการ
async removeMany(ids: number[]) {
  return this.prisma.concertEvent.deleteMany({
    where: {
      id: { in: ids },
    },
  });
}
```

---

## 📁 โครงสร้างไฟล์ที่แนะนำ

```
src/concerts/
├── concerts.controller.ts     # Routes & HTTP handling
├── concerts.service.ts        # Business logic (ไฟล์นี้!)
├── concerts.module.ts         # Module config
├── dto/
│   ├── create-concert.dto.ts  # DTO สำหรับสร้าง
│   ├── update-concert.dto.ts  # DTO สำหรับอัปเดต
│   └── filter-concert.dto.ts  # DTO สำหรับ filter
├── entities/
│   └── concert.entity.ts      # Entity (optional)
└── interfaces/
    └── concert.interface.ts   # Interfaces (optional)
```

---

## 🎨 ตัวอย่าง Service เต็มรูปแบบ

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  // 1. CRUD พื้นฐาน
  async create(dto: CreateConcertDto) { }
  async findAll() { }
  async findOne(id: number) { }
  async update(id: number, dto: Partial<CreateConcertDto>) { }
  async remove(id: number) { }

  // 2. Search & Filter
  async search(name: string) { }
  async filter(filters: any) { }

  // 3. Pagination & Sorting
  async findAllPaginated(page: number, limit: number) { }
  async findAllSorted(sortBy: string, order: 'asc' | 'desc') { }

  // 4. Business Logic
  async reserveSeat(id: number, seats: number) { }
  async cancelReservation(id: number, seats: number) { }

  // 5. Statistics
  async count() { }
  async getStatistics() { }

  // 6. Bulk Operations
  async createMany(dtos: CreateConcertDto[]) { }
  async removeMany(ids: number[]) { }
}
```

---

## 💡 Best Practices

### 1. **แยก Business Logic ออกจาก Controller**
```typescript
// ❌ ไม่ดี - Logic ใน Controller
@Post()
async create(@Body() dto: CreateConcertDto) {
  return this.prisma.concertEvent.create({ data: dto });
}

// ✅ ดี - Logic ใน Service
@Post()
async create(@Body() dto: CreateConcertDto) {
  return this.service.create(dto);
}
```

### 2. **ใช้ Error Handling ที่ชัดเจน**
```typescript
async findOne(id: number) {
  const concert = await this.prisma.concertEvent.findUnique({
    where: { id },
  });

  if (!concert) {
    throw new NotFoundException(`ไม่พบคอนเสิร์ต ID: ${id}`);
  }

  return concert;
}
```

### 3. **ตรวจสอบเงื่อนไขก่อนทำงาน**
```typescript
async reserveSeat(id: number, seats: number) {
  const concert = await this.findOne(id);

  // ตรวจสอบที่นั่ง
  const available = concert.seat - concert.seatReserve;
  if (available < seats) {
    throw new Error(`ที่นั่งไม่พอ! เหลือ ${available} ที่นั่ง`);
  }

  // ดำเนินการจอง
  return this.prisma.concertEvent.update({...});
}
```

### 4. **ใช้ Transaction สำหรับ Multi-step Operations**
```typescript
async transferSeats(fromId: number, toId: number, seats: number) {
  return this.prisma.$transaction(async (tx) => {
    // ลดที่นั่งจากคอนเสิร์ตต้นทาง
    await tx.concertEvent.update({
      where: { id: fromId },
      data: { seat: { decrement: seats } },
    });

    // เพิ่มที่นั่งให้คอนเสิร์ตปลายทาง
    await tx.concertEvent.update({
      where: { id: toId },
      data: { seat: { increment: seats } },
    });
  });
}
```

### 5. **Reusable Helper Methods**
```typescript
private async checkConcertExists(id: number) {
  const concert = await this.findOne(id);
  return concert;
}

private calculateAvailableSeats(concert: any) {
  return concert.seat - concert.seatReserve;
}
```

---

## 🧪 การทดสอบ Services

```typescript
// concerts.service.spec.ts
describe('ConcertsService', () => {
  let service: ConcertsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertsService, PrismaService],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a concert', async () => {
    const dto = {
      concert_name: 'Test Concert',
      seat: 100,
      description: 'Test',
    };

    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.concertName).toBe(dto.concert_name);
  });
});
```

---

## 📊 สรุป

### Service ควรมี:
1. ✅ CRUD พื้นฐาน (Create, Read, Update, Delete)
2. ✅ Search & Filter
3. ✅ Pagination & Sorting
4. ✅ Business Logic เฉพาะ
5. ✅ Statistics & Aggregation
6. ✅ Error Handling ที่ดี
7. ✅ Transaction สำหรับ complex operations

### จำไว้:
- **Controller** = จัดการ HTTP requests/responses
- **Service** = ทำ Business Logic ทั้งหมด
- **Prisma** = เชื่อมต่อกับ Database

---

Happy Coding! 🚀
