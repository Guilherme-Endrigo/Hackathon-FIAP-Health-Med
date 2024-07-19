import { Body, Controller, Post } from '@nestjs/common';
import { LoginDoctorDto } from '../dto/login-doctor.dto';
import { AuthService } from '../../domain/use-cases/auth.service';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDoctorDto: LoginDoctorDto) {
        return await this.authService.validateDoctor(loginDoctorDto);
    }
}
