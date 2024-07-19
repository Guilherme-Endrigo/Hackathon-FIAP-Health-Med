import { Injectable } from '@nestjs/common';
import { SchedulePort } from '../../domain/ports/schedule.port';
import { ScheduleDto } from '../../api/dto/schedule.dto';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class ScheduleAdapter implements SchedulePort {
    constructor(@InjectKnex() private readonly knex: Knex) { }

    async create(scheduleDto: ScheduleDto): Promise<boolean> {
        const doctor = await this.knex('doctors')
            .where({ crm: scheduleDto.crm })
            .first();

        return doctor;
    }

    async get(loginDoctorDto: ScheduleDto): Promise<boolean> {
        const doctor = await this.knex('doctors')
            .where({ crm: loginDoctorDto.crm })
            .first();

        return doctor;
    }
}
