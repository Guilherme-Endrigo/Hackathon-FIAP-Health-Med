import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorPort } from '../../domain/ports/doctor.port';
import { SearchDoctorDto } from '../../api/dto/search-doctor.dto';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class DoctorAdapter implements DoctorPort {
    constructor(@InjectKnex() private readonly knex: Knex) { }

    async search(searchParams: SearchDoctorDto): Promise<any> {
        let query = this.knex('doctors')
            .select('doctors.name', 'doctors.crm');

        if (searchParams.specialty) {
            query = query
                .join('doctors_specialties', 'doctors.id', 'doctors_specialties.doctor_id')
                .join('specialties', 'specialties.id', 'doctors_specialties.specialty_id')
                .select('specialties.name AS specialties_name')
                .where('doctors_specialties.specialty_id', searchParams.specialty);
        }

        if (searchParams.review) {
            query = query
                .join('reviews', 'doctors.id', 'reviews.doctor_id')
                .select('reviews.rating')
                .where('reviews.rating', '>=', searchParams.review);
        }

        if (searchParams.coordinates) {
            const [latitude, longitude] = searchParams.coordinates.split(',').map(Number);
            const distance = 5;

            query = query                
                .select(
                    this.knex.raw(
                        `ROUND(ST_Distance_Sphere(POINT(doctors.longitude, doctors.latitude), POINT(?, ?)) / 1000, 2) AS distance`,
                        [longitude, latitude]
                    )
                )
                .having('distance', '<=', distance);
        }

        const doctors = await query;

        if (!doctors.length) {
            throw new NotFoundException('No doctors found matching the criteria');
        }

        return doctors;
    }
}
