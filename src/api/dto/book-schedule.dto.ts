import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class BookScheduleDto {
    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @IsNotEmpty()
    @IsDateString()
    date_schedule: string;

    @IsNotEmpty()
    start_time: string;

    @IsNotEmpty()
    end_time: string;
}
