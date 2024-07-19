import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleUseCase } from '../../domain/use-cases/schedule.use-case';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly scheduleUseCase: ScheduleUseCase) { }

    @Get()
    async get(@Body() scheduleDto: ScheduleDto) {
        return await this.scheduleUseCase.create(scheduleDto);
    }

    @Post('create')
    async create(@Body() scheduleDto: ScheduleDto) {
        return await this.scheduleUseCase.get(scheduleDto);
    }
}
