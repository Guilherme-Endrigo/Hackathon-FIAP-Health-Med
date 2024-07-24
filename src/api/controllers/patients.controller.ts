import { Body, Controller, Post } from '@nestjs/common';
import { LoginPatientDto } from '../dto/login-patient.dto';
import { AuthService } from '../../domain/use-cases/auth.service';

@Controller('patients')
export class PatientsController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginPatientDto: LoginPatientDto) {
        return await this.authService.validatePatient(loginPatientDto);
    }
}
