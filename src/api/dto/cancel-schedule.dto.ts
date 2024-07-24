import { IsNotEmpty, IsString } from 'class-validator';

export class CancelScheduleDto {
    @IsNotEmpty()
    @IsString()
    reason: string;
}
