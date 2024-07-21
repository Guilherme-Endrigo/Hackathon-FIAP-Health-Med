import { Injectable } from '@nestjs/common';
import { LoginPatientPort } from '../../domain/ports/login-patient.port';
import { LoginPatientDto } from '../../api/dto/login-patient.dto';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class LoginPatientAdapter implements LoginPatientPort {
    constructor(@InjectKnex() private readonly knex: Knex) { }

    async validatePatient(loginPatientDto: LoginPatientDto): Promise<boolean> {
        const patient = await this.knex('patients')
            .where({ email: loginPatientDto.email, cpf: loginPatientDto.cpf })
            .first();

        if (patient) {
            return bcrypt.compare(loginPatientDto.password, patient.password);
        }
        return false;
    }
}
