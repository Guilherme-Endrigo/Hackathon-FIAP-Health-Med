import { Injectable } from '@nestjs/common';
import { LoginDoctorPort } from '../../domain/ports/login-doctor.port';
import { LoginDoctorDto } from '../../api/dto/login-doctor.dto';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class LoginDoctorAdapter implements LoginDoctorPort {
    constructor(@InjectKnex() private readonly knex: Knex) { }

    async validateDoctor(loginDoctorDto: LoginDoctorDto): Promise<boolean> {
        const doctor = await this.knex('doctors')
            .where({ crm: loginDoctorDto.crm })
            .first();
            
        if (doctor) {
            return bcrypt.compare(loginDoctorDto.password, doctor.password);
        }
        return false;
    }
}
