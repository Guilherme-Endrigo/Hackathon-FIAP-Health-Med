import { ScheduleDto } from '../../api/dto/schedule.dto';

export interface SchedulePort {
    create(scheduleDto: ScheduleDto): Promise<boolean>;
    get(scheduleDto: ScheduleDto): Promise<boolean>;
}
