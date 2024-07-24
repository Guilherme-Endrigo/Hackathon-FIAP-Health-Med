import { Injectable, Inject } from '@nestjs/common';
import { SearchDoctorDto } from '../../api/dto/search-doctor.dto';
import { DoctorPort } from '../ports/doctor.port';

@Injectable()
export class SearchDoctorUseCase {
    constructor(
        @Inject('DoctorPort') private readonly doctorPort: DoctorPort,
    ) { }

    async execute(searchDoctorDto: SearchDoctorDto): Promise<any> {
        return await this.doctorPort.search(searchDoctorDto);
    }
}
