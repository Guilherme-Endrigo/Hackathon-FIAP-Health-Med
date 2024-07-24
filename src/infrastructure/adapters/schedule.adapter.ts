import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SchedulePort } from '../../domain/ports/schedule.port';
import { ScheduleDto } from '../../api/dto/schedule.dto';
import { BookScheduleDto } from '../../api/dto/book-schedule.dto';
import { CancelScheduleDto } from '../../api/dto/cancel-schedule.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { StatusAppointmentEnum } from '../enums/status-appointment.enum';

@Injectable()
export class ScheduleAdapter implements SchedulePort {
    constructor(@InjectKnex() private readonly knex: Knex) { }

    async create(scheduleDto: ScheduleDto, doctorCrm: string): Promise<boolean> {
        const existingSchedule = await this.knex('available_schedules')
            .join('doctors', 'available_schedules.doctor_id', '=', 'doctors.id')
            .where({
                'doctors.crm': doctorCrm,
                'available_schedules.date_schedule': scheduleDto.date_schedule,
                'available_schedules.start_time': scheduleDto.start_time,
                'available_schedules.end_time': scheduleDto.end_time,
            })
            .first();

        if (existingSchedule) {
            throw new BadRequestException('Schedule already exists for the given time');
        }

        const doctor = await this.knex('doctors').where({ crm: doctorCrm }).first();
        if (!doctor) {
            throw new BadRequestException('Doctor not found');
        }

        const duration = this.calculateDuration(scheduleDto.start_time, scheduleDto.end_time);
        if (duration < 50 || duration > 60) {
            throw new BadRequestException('Schedule duration must be between 50 to 60 minutes');
        }

        await this.knex('available_schedules').insert({
            doctor_id: doctor.id,
            date_schedule: scheduleDto.date_schedule,
            start_time: scheduleDto.start_time,
            end_time: scheduleDto.end_time,
        });

        return true;
    }

    async edit(scheduleDto: ScheduleDto, doctorCrm: string): Promise<boolean> {
        const doctor = await this.knex('doctors').where({ crm: doctorCrm }).first();
        if (!doctor) {
            throw new BadRequestException('Doctor not found');
        }

        const schedule = await this.knex('available_schedules')
            .where({
                id: scheduleDto.id,
                doctor_id: doctor.id,
            })
            .first();

        if (!schedule) {
            throw new BadRequestException('Schedule not found');
        }

        const duration = this.calculateDuration(scheduleDto.start_time, scheduleDto.end_time);
        if (duration < 50 || duration > 60) {
            throw new BadRequestException('Schedule duration must be between 50 to 60 minutes');
        }

        const updateResult = await this.knex('available_schedules')
            .where({ id: scheduleDto.id })
            .update({
                date_schedule: scheduleDto.date_schedule,
                start_time: scheduleDto.start_time,
                end_time: scheduleDto.end_time,
            });

        if (updateResult === 0) {
            throw new BadRequestException('No changes were made to the schedule');
        }

        return true;
    }

    async getScheduleByDoctorId(doctorId: number): Promise<any> {
        const schedule = await this.knex('available_schedules')
            .join('doctors', 'available_schedules.doctor_id', '=', 'doctors.id')
            .where('doctors.id', doctorId)
            .select(
                'available_schedules.id',
                'available_schedules.date_schedule',
                'available_schedules.start_time',
                'available_schedules.end_time',
                'doctors.consultation_fee'
            );

        if (!schedule.length) {
            throw new NotFoundException('No available schedule found for the specified doctor');
        }

        return schedule;
    }

    async book(bookScheduleDto: BookScheduleDto, patientCpf: string): Promise<boolean> {
        const patient = await this.knex('patients').where({ cpf: patientCpf}).first();
        
        const availableSchedule = await this.knex('available_schedules')
            .join('doctors', 'available_schedules.doctor_id', '=', 'doctors.id')
            .where({
                'doctors.id': bookScheduleDto.doctorId,
                'available_schedules.date_schedule': bookScheduleDto.date_schedule,
                'available_schedules.start_time': bookScheduleDto.start_time,
                'available_schedules.end_time': bookScheduleDto.end_time,
            })
            .first();

        if (!availableSchedule) {
            throw new BadRequestException('The selected schedule is not available');
        }
        
        const appointment = await this.knex('appointments')
            .where({
                doctor_id: bookScheduleDto.doctorId,
                patient_id: patient.id,
                date_appointment: bookScheduleDto.date_schedule,
                start_time: bookScheduleDto.start_time,
                end_time: bookScheduleDto.end_time, 
            })
            .first();

        if (appointment) {
            throw new BadRequestException('You already have an appointment scheduled for this time');
        }

        await this.knex('appointments').insert({
            doctor_id: bookScheduleDto.doctorId,
            patient_id: patient.id,
            date_appointment: bookScheduleDto.date_schedule,
            start_time: bookScheduleDto.start_time,
            end_time: bookScheduleDto.end_time,
            status: StatusAppointmentEnum['Pending'],
            amount: availableSchedule.consultation_fee,
        });

        return true;
    }

    async cancel(id: number, patientCpf: string, cancelScheduleDto: CancelScheduleDto): Promise<boolean> {
        const patient = await this.knex('patients').where({ cpf: patientCpf }).first();

        const appointment = await this.knex('appointments')
            .where({
                id: id,
                patient_id: patient.id,
            })
            .first();

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        await this.knex('appointments')
            .where({ id: id })
            .update({
                status: StatusAppointmentEnum['Canceled'],
                reason: cancelScheduleDto.reason,
            });

        return true;
    }

    async getAll(doctorCrm: string): Promise<any> {
        const schedule = await this.knex('appointments')
            .join('patients', 'appointments.patient_id', '=', 'patients.id')
            .join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            .select(
                'appointments.date_appointment',
                'appointments.start_time',
                'appointments.end_time',
                this.knex.raw(`
                CASE
                    WHEN appointments.status = 0 THEN 'Pending'
                    WHEN appointments.status = 1 THEN 'Accepted'
                    WHEN appointments.status = 2 THEN 'Rejected'
                    WHEN appointments.status = 3 THEN 'Canceled'
                    ELSE 'Unknown'
                END AS status_appointment
            `),
                'patients.name AS name_patient'
            )
           .where({ crm: doctorCrm});

        if (!schedule.length) {
            throw new NotFoundException('No available books');
        }

        return schedule;
    }


    async reject(id: number, doctorCrm: string): Promise<boolean> {
        
        const appointment = await this.knex('appointments')
            .join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            .where({
                'appointments.id': id,
                crm: doctorCrm
            })
            .first();

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        await this.knex('appointments')
            .where({ id: id })
            .update({
                status: StatusAppointmentEnum['Rejected']
            });

        return true;
    }

    async accept(id: number, doctorCrm: string): Promise<boolean> {

        const appointment = await this.knex('appointments')
            .join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            .where({
                'appointments.id': id,
                crm: doctorCrm
            })
            .first();

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        await this.knex('appointments')
            .where({ id: id })
            .update({
                status: StatusAppointmentEnum['Accepted']
            });

        return true;
    }

    private calculateDuration(start_time: string, end_time: string): number {
        const start = new Date(`1970-01-01T${start_time}Z`);
        const end = new Date(`1970-01-01T${end_time}Z`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60);
        return duration;
    }
}
