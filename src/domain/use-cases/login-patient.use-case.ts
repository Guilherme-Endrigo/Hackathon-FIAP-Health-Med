import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { LoginPatientDto } from '../../api/dto/login-patient.dto';
import { LoginPatientPort } from '../ports/login-patient.port';

@Injectable()
export class LoginPatientUseCase {
    constructor(
        @Inject('LoginPatientPort') private readonly loginPatientPort: LoginPatientPort,
    ) { }

    async execute(loginPatientDto: LoginPatientDto): Promise<{ success: boolean; message: string }> {
        const isValid = await this.loginPatientPort.validatePatient(loginPatientDto);
        if (isValid) {
            return { success: true, message: 'Login successful' };
        }

        throw new BadRequestException('Invalid email, CPF, or password');
    }
}
