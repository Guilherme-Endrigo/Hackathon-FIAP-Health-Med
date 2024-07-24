import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginPatientDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    password: string;
}
