import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) { }

  async create(createConcertDto: CreateConcertDto) {
    return this.prisma.concertevent.create({
      data: {
        concertName: createConcertDto.concert_name,
        seat: createConcertDto.seat,
        description: createConcertDto.description,
        seatReserve: 0,
        seatCancel: 0,
      },
    });
  }


  async findAll() {
    return this.prisma.concertevent.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getDashboardData() {
    const sums = await this.prisma.concertevent.aggregate({
      _sum: {
        seat: true,
        seatReserve: true,
        seatCancel: true,
      },
    });

    return {
      totalSeat: sums._sum?.seat ?? 0,
      totalSeatReserve: sums._sum?.seatReserve ?? 0,
      totalSeatCancel: sums._sum?.seatCancel ?? 0,
    };
  }

  async getHistory() {
    return this.prisma.history.findMany({
      include : {
        concertevent: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
