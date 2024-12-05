import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { CustomResponseDto } from 'src/utils/custom-response.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { RegisterResponseDTO } from './dto/response/register-response.dto';
import { ActivateAccountRequestDTO } from './dto/request/activate-account-request.dto';
import { ActivateAccountResponseDTO } from './dto/response/activate-account-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginRequestDTO } from './dto/request/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() request: RegisterRequestDTO, @Res() response: Response): Promise<RegisterResponseDTO | any> {
    try {
      const responseData: RegisterResponseDTO = await this.authService.register(request);

      const successResponse = new CustomResponseDto(201, 'Registration process successful. Please check your email.', responseData, null, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

  @Post('activate-account')
  @UseInterceptors(NoFilesInterceptor())
  async activateAccount(@Body() request: ActivateAccountRequestDTO, @Res() response: Response): Promise<ActivateAccountResponseDTO | any> {
    try {
      const responseData: ActivateAccountResponseDTO = await this.authService.activateAccount(request);

      const successResponse = new CustomResponseDto(200, 'Activation process successful. Please login', responseData, null, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async login(@Body() request: LoginRequestDTO, @Res() response: Response) {
    try {
      const responseData = await this.authService.login(request)
      const successResponse = new CustomResponseDto(200, 'Login successful', responseData, null, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

}
