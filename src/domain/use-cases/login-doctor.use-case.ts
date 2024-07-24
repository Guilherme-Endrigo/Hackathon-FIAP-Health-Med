import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { LoginDoctorDto } from '../../api/dto/login-doctor.dto';
import { LoginDoctorPort } from '../ports/login-doctor.port';

@Injectable()
export class LoginDoctorUseCase {
    constructor(
        @Inject('LoginDoctorPort') private readonly loginDoctorPort: LoginDoctorPort,
    ) { }

    async execute(loginDoctorDto: LoginDoctorDto): Promise<{ success: boolean; message: string }> {
        const isValid = await this.loginDoctorPort.validateDoctor(loginDoctorDto);
        if (isValid) {
            return { success: true, message: 'Login successful' };
        }
        
        throw new BadRequestException('Invalid CRM or password');
    }
}
