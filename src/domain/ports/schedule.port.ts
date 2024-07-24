// src/domain/ports/schedule.port.ts
import { BookScheduleDto } from 'src/api/dto/book-schedule.dto';
import { ScheduleDto } from '../../api/dto/schedule.dto';
import { CancelScheduleDto } from 'src/api/dto/cancel-schedule.dto';

export interface SchedulePort {
    create(scheduleDto: ScheduleDto, doctorCrm: string): Promise<boolean>;
    //get(scheduleDto: ScheduleDto): Promise<any>;
    edit(scheduleDto: ScheduleDto, doctorCrm: string): Promise<boolean>;
    getScheduleByDoctorId(doctorId: number): Promise<any>;
    book(bookScheduleDto: BookScheduleDto, patientCpf: string): Promise<boolean>;
    cancel(id: number, patientCpf: string, cancelScheduleDto: CancelScheduleDto): Promise<boolean>;
    getAll(doctorCrm: string): Promise<any>;
    reject(id: number, doctorCrm: string): Promise<boolean>;
    accept(id: number, doctorCrm: string): Promise<boolean>;
}
