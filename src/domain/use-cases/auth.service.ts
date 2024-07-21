import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDoctorDto } from '../../api/dto/login-doctor.dto';
import { LoginDoctorUseCase } from './login-doctor.use-case';
import { LoginPatientDto } from '../../api/dto/login-patient.dto';
import { LoginPatientUseCase } from './login-patient.use-case';

@Injectable()
export class AuthService {
    constructor(
        private readonly loginDoctorUseCase: LoginDoctorUseCase,
        private readonly loginPatientUseCase: LoginPatientUseCase,
        private readonly jwtService: JwtService,
    ) { }

    async validateDoctor(loginDoctorDto: LoginDoctorDto): Promise<{ success: boolean; message: string; access_token?: string }> {
        const isValid = await this.loginDoctorUseCase.execute(loginDoctorDto);
        if (isValid.success) {
            const payload = { crm: loginDoctorDto.crm };
            const access_token = this.jwtService.sign(payload);
            return { success: true, message: 'Login successful', access_token };
        } else {
            return { success: false, message: 'Invalid CRM or password' };
        }
    }

    async validatePatient(loginPatientDto: LoginPatientDto): Promise<{ success: boolean; message: string; access_token?: string }> {        
        const isValid = await this.loginPatientUseCase.execute(loginPatientDto);
        if (isValid.success) {
            const payload = { email: loginPatientDto.email, cpf: loginPatientDto.cpf };
            const access_token = this.jwtService.sign(payload);
            return { success: true, message: 'Login successful', access_token };
        } else {
            return { success: false, message: 'Invalid email, CPF, or password' };
        }
    }
}
