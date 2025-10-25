import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateConcertDto } from './dto/create-concert.dto';
import { PrismaService } from '../prisma.service';
import { stat } from 'fs';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async reserveSeat(id: string, type: string) {
        const concertId = parseInt(id, 10);
        const seatType = type;
        const concert = await this.prisma.concertevent.findUnique({
            where: { id: concertId },
        });
        if (!concert) {
            throw new NotFoundException(`Concert with ID ${concertId} not found`);
        }
        if (seatType === 'reserve') {
            await this.prisma.concertevent.update({
                where: { id: concertId },
                data: {
                    seatReserve: (concert.seatReserve || 0) + 1,
                },
            });
        } else if (seatType === 'cancel') {
            await this.prisma.concertevent.update({
                where: { id: concertId },
                data: {
                    seatCancel: (concert.seatCancel || 0) + 1,
                },
            });
        } else {
            throw new NotFoundException(`Invalid seat type: ${seatType}`);
        }

        await this.prisma.history.create({
            data: {
            concertId: concertId,
            userId: 1,
            action: seatType,
            date: new Date(Date.now() + 7 * 60 * 60 * 1000),
            },
        });

        return { 
            status : 'success',
            message: `Seat ${seatType}d successfully for concert ID ${concertId}` };
    }

}
