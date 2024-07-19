import { LoginDoctorDto } from '../../api/dto/login-doctor.dto';

export interface LoginDoctorPort {
    validateDoctor(loginDoctorDto: LoginDoctorDto): Promise<boolean>;
}
