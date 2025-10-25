import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts') // Base path: /concerts
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) { }


  @Post('create') // POST /concerts/create
  async create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }


  @Get() // GET /concerts
  async findAll() {
    return this.concertsService.findAll();
  }

  @Get('dashboard') // GET /concerts/dashboard
  async getDashboardData() {
    return this.concertsService.getDashboardData();
  }

  @Get('history') // GET /concerts/history
  async getHistory() {
    return this.concertsService.getHistory();
  } 
}
