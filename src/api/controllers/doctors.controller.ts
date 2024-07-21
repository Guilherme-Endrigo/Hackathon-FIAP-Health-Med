import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDoctorDto } from '../dto/login-doctor.dto';
import { AuthService } from '../../domain/use-cases/auth.service';
import { SearchDoctorDto } from '../dto/search-doctor.dto';
import { SearchDoctorUseCase } from 'src/domain/use-cases/search-doctor.use-case';

@Controller('doctors')
export class DoctorsController {
    constructor(
        private readonly authService: AuthService, 
        private readonly searchDoctorUseCase: SearchDoctorUseCase
    ) { }

    @Post('login')
    async login(@Body() loginDoctorDto: LoginDoctorDto) {
        return await this.authService.validateDoctor(loginDoctorDto);
    }

    @Get('search')
    async search(
        @Query() searchDoctorDto : SearchDoctorDto
    ) {
        console.log(searchDoctorDto);        
        return await this.searchDoctorUseCase.execute(searchDoctorDto);
    }
}
