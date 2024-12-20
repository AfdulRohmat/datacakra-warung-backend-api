import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/users/entities/role.entity";
import { IsUnique } from "src/utils/validation/is-unique";

export class RegisterRequestDTO {
    @IsString()
    @IsNotEmpty({ message: "username cannot be empty" })
    @MinLength(2, { message: 'username must consist of at least 4 characters' })
    username: string;

    @IsUnique({ tableName: 'users', column: 'email' })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Password must consist of at least 4 characters' })
    password: string;

}