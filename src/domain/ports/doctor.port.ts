import { SearchDoctorDto } from '../../api/dto/search-doctor.dto';

export interface DoctorPort {
    search(searchDoctorDto: SearchDoctorDto): Promise<any>;
}
