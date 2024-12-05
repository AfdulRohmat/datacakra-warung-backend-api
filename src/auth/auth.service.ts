import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { RegisterResponseDTO } from './dto/response/register-response.dto';
import * as bcrypt from 'bcrypt';
import { Role, UserRole } from 'src/users/entities/role.entity';
import { EmailService } from 'src/email/email.service';
import { ActivateAccountRequestDTO } from './dto/request/activate-account-request.dto';
import { ActivateAccountResponseDTO } from './dto/response/activate-account-response.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import { LoginResponseDto as LoginResponseDTO } from './dto/response/login-response.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) { }

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // bcrypt password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // generate random activation code
    const activationCode: number = Math.floor(100000 + Math.random() * 900000)

    // adding role
    const userRole = new Role();
    userRole.name = UserRole.USER
    await this.roleRepository.save(userRole)

    // adding user
    const user = new User();
    user.username = request.username
    user.email = request.email
    user.password = hashedPassword
    user.isVerified = false
    user.activationCode = activationCode
    user.roles = [userRole]

    await this.userRepository.save(user);

    // send to email
    this.emailService.sendUserConfirmation(user)

    return new RegisterResponseDTO(
      user.email,
      "Registration success, please check your email or use this activation code to activate your account",
      user.activationCode
    )
  }

  async activateAccount(request: ActivateAccountRequestDTO): Promise<ActivateAccountResponseDTO> {
    // find user base on email, if not exist, throw error
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: request.email
      }
    })

    // check if the email alreadt verified or not, if verified throw error
    if (user.isVerified) {
      // throw new HttpException('', HttpStatus.BAD_REQUEST);
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Account has been verified. Please login' })
    }

    // check activation code that store inside db before
    if (user.activationCode == request.activationCode) {
      // if match, set isVerified to be true
      user.isVerified = true;
      await this.userRepository.save(user);

      return new ActivateAccountResponseDTO(user.email, "Activation success, please login")
    } else {
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Invalid activation code' })
    }
  }

  async login(request: LoginRequestDTO): Promise<LoginResponseDTO> {

    const user: User = await this.userRepository.findOneOrFail({
      where: {
        email: request.email
      }
    })

    if (!user) {
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Wrong email or password' })
    }

    if (user.isVerified == false) {
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Account not verified. Please verify first' })
    }

    const actualPassword: boolean = await bcrypt.compare(request.password, user.password)
    if (actualPassword == false) {
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Wrong email or password' })
    }

    const payload = {
      username: user.email,
      sub: {
        username: user.username,
      }
    }
    const jwtSign = this.jwtService.sign(payload)

    return new LoginResponseDTO(
      user.username,
      user.email,
      jwtSign
    )


  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: username
      }
    })

    if (user.isVerified == false) {
      throw new BadRequestException('Proses failed', { cause: new Error(), description: 'Account not verified. Please verify first' })
    }

    const actualPassword = await bcrypt.compare(password, user.password)

    if (user && actualPassword) {
      const { password, ...rest } = user

      return rest;
    }

    return null;
  }

  async logout(): Promise<void> { }

}
