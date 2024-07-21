import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { JwtModule } from '@nestjs/jwt';
//import { jwtConstants } from './config/jwt.config';
import { HealthController } from 'src/api/controllers/health.controller';
import { OrderController } from 'src/api/controllers/order.controller';
import { OrderService } from 'src/domain/use-cases/order.service';
import { RequestService } from 'src/infrastructure/axios/request.service';
import { OrderRequestService } from 'src/infrastructure/axios/order.request.service';
import { DoctorsController } from './api/controllers/doctors.controller';
import { LoginDoctorUseCase } from './domain/use-cases/login-doctor.use-case';
import { ScheduleUseCase } from './domain/use-cases/schedule.use-case';
import { AuthService } from './domain/use-cases/auth.service';
import { LoginDoctorAdapter } from './infrastructure/adapters/login-doctor.adapter';
import { ScheduleAdapter } from './infrastructure/adapters/schedule.adapter';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './shared/auth/jwt.strategy';
import { ScheduleController } from './api/controllers/schedule.controller';
import { PatientsController } from './api/controllers/patients.controller';
import { LoginPatientUseCase } from './domain/use-cases/login-patient.use-case';
import { LoginPatientAdapter } from './infrastructure/adapters/login-patient.adapter';
import { SearchDoctorUseCase } from './domain/use-cases/search-doctor.use-case';
import { DoctorAdapter } from './infrastructure/adapters/doctor.adapter';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          port: 3307,
          user: 'clinicuser',
          password: 'clinicpassword',
          database: 'clinic_fiap_project',
        },
      },
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [HealthController, OrderController, DoctorsController, ScheduleController, PatientsController],
  providers: [
    RequestService,
    OrderRequestService,
    OrderService,
    LoginDoctorUseCase,
    AuthService,
    ScheduleUseCase,
    JwtStrategy,
    LoginPatientUseCase,
    SearchDoctorUseCase,
    {
      provide: 'OrderRequestService',
      useClass: OrderRequestService,
    },
    {
      provide: 'OrderService',
      useClass: OrderService,
    },
    {
      provide: 'LoginDoctorPort',
      useClass: LoginDoctorAdapter,
    },
    {
      provide: 'SchedulePort',
      useClass: ScheduleAdapter,
    },
    {
      provide: 'LoginPatientPort',
      useClass: LoginPatientAdapter,
    },
    {
      provide: 'DoctorPort',
      useClass: DoctorAdapter,
    },
  ],
  exports: [JwtModule],
})
export class AppModule { }
