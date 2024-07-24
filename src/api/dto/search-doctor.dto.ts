import { IsOptional, IsNumber, IsString } from 'class-validator';

export class SearchDoctorDto {
    @IsOptional()
    @IsNumber()
    specialty?: number;

    @IsOptional()
    @IsString()
    coordinates?: string; // Expecting a string format "latitude,longitude"

    @IsOptional()
    @IsNumber()
    review?: number;

    @IsOptional()
    @IsNumber()
    distance?: number; // Distance in kms
}
