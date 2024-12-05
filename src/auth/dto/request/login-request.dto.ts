import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/users/entities/role.entity";
import { IsUnique } from "src/utils/validation/is-unique";

export class LoginRequestDTO {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Password must consist of at least 4 characters' })
    password: string;

}