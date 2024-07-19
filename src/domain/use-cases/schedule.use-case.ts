import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ScheduleDto } from '../../api/dto/schedule.dto';
import { SchedulePort } from '../ports/schedule.port';

@Injectable()
export class ScheduleUseCase {
    constructor(
        @Inject('LoginDoctorPort') private readonly schedulePort: SchedulePort,
    ) { }

    async create(loginDoctorDto: ScheduleDto): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.create(loginDoctorDto);
        if (isValid) {
            return { success: true, message: 'Login successful' };
        }

        throw new BadRequestException('Invalid CRM or password');
    }

    async get(loginDoctorDto: ScheduleDto): Promise<{ success: boolean; message: string }> {
        const isValid = await this.schedulePort.get(loginDoctorDto);
        if (isValid) {
            return { success: true, message: 'Login successful' };
        }

        throw new BadRequestException('Invalid CRM or password');
    }
}
