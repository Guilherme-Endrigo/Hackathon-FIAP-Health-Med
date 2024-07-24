import { LoginPatientDto } from '../../api/dto/login-patient.dto';

export interface LoginPatientPort {
    validatePatient(loginPatientDto: LoginPatientDto): Promise<boolean>;
}
