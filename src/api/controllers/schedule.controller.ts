import { Body, Controller, Get, Post, Put, Delete, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleUseCase } from '../../domain/use-cases/schedule.use-case';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { BookScheduleDto } from '../dto/book-schedule.dto';
import { CancelScheduleDto } from '../dto/cancel-schedule.dto';

@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleUseCase: ScheduleUseCase) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() scheduleDto: ScheduleDto) {
        const doctorCrm = req.user.crm;
        return await this.scheduleUseCase.create(scheduleDto, doctorCrm);
    }

    @UseGuards(JwtAuthGuard)
    @Put('edit')
    async edit(@Request() req, @Body() scheduleDto: ScheduleDto) {
        const doctorCrm = req.user.crm;
        return await this.scheduleUseCase.edit(scheduleDto, doctorCrm);
    }

    @Get(':doctorId')
    async getSchedule(@Param('doctorId') doctorId: number) {
        return await this.scheduleUseCase.getScheduleByDoctorId(doctorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('book')
    async book(@Request() req, @Body() bookScheduleDto: BookScheduleDto) {        
        const patientCpf = req.user.cpf;
        return await this.scheduleUseCase.book(bookScheduleDto, patientCpf);
    }

    @UseGuards(JwtAuthGuard)
    @Get('all/list')
    async getAll(@Request() req) {
        const doctorCrm = req.user.crm;
        return await this.scheduleUseCase.getAll(doctorCrm);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('reject/:id')
    async reject(@Request() req, @Param('id') id: number) {
        const doctorCrm = req.user.crm;
        return await this.scheduleUseCase.reject(id, doctorCrm);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('accept/:id')
    async accept(@Request() req, @Param('id') id: number) {
        const doctorCrm = req.user.crm;
        return await this.scheduleUseCase.accept(id, doctorCrm);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('cancel/:id')
    async cancel(@Request() req, @Param('id') id: number, @Body() cancelScheduleDto: CancelScheduleDto) {
        const patientCpf = req.user.cpf;
        return await this.scheduleUseCase.cancel(id, patientCpf, cancelScheduleDto);
    }
}
