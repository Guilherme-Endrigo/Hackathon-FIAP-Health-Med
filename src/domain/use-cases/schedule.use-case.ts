import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ScheduleDto } from '../../api/dto/schedule.dto';
import { SchedulePort } from '../ports/schedule.port';
import { BookScheduleDto } from '../../api/dto/book-schedule.dto';
import { CancelScheduleDto } from '../../api/dto/cancel-schedule.dto';

@Injectable()
export class ScheduleUseCase {
    constructor(
        @Inject('SchedulePort') private readonly schedulePort: SchedulePort,
    ) { }

    async create(scheduleDto: ScheduleDto, doctorCrm: string): Promise<{ success: boolean; message: string }> {
        try {
            const isValid = await this.schedulePort.create(scheduleDto, doctorCrm);
            if (isValid) {
                return { success: true, message: 'Schedule created successfully' };
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async edit(scheduleDto: ScheduleDto, doctorCrm: string): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.edit(scheduleDto, doctorCrm);
        if (isValid) {
            return { success: true, message: 'Schedule edited successfully' };
        }

        throw new BadRequestException('Schedule editing failed');
    }

    async getScheduleByDoctorId(doctorId: number): Promise<any> {
        const schedule = await this.schedulePort.getScheduleByDoctorId(doctorId);
        if (!schedule.length) {
            throw new NotFoundException('No available schedule found for the specified doctor');
        }
        return schedule;
    }

    async book(bookScheduleDto: BookScheduleDto, patientCpf: string): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.book(bookScheduleDto, patientCpf);
        if (isValid) {
            return { success: true, message: 'Appointment booked successfully' };
        }

        throw new BadRequestException('Booking failed');
    }

    async getAll(doctorCrm: string): Promise<any> {
        const schedule = await this.schedulePort.getAll(doctorCrm);
        if (!schedule.length) {
            throw new NotFoundException('No available books');
        }
        return schedule;
    }

    async reject(id: number, doctorCrm: string): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.reject(id, doctorCrm);
        if (isValid) {
            return { success: true, message: 'Appointment rejected successfully' };
        }

        throw new BadRequestException('Rejected failed');
    }

    async accept(id: number, doctorCrm: string): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.accept(id, doctorCrm);
        if (isValid) {
            return { success: true, message: 'Appointment accept successfully' };
        }

        throw new BadRequestException('Accepted failed');
    }

    async cancel(id: number, patientCpf: string, cancelScheduleDto: CancelScheduleDto): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.cancel(id, patientCpf, cancelScheduleDto);
        if (isValid) {
            return { success: true, message: 'Appointment cancelled successfully' };
        }

        throw new BadRequestException('Cancellation failed');
    }
}
