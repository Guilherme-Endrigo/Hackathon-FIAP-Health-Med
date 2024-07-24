import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class ScheduleDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    @IsString()
    crm: string;

    @IsNotEmpty()
    @IsDateString()
    date_schedule: string;

    @IsNotEmpty()
    start_time: string;

    @IsNotEmpty()
    end_time: string;
}
