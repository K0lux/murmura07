import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import {
  CurrentUser,
  type AuthenticatedUser
} from '../../common/decorators/current-user.decorator.js';
import type { RequestPhoneOtpDto } from './dto/request-phone-otp.dto.js';
import type { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const metadata: {
      firstName?: string;
      lastName?: string;
      preferredCommunicationStyle?: string;
    } = {};

    if (body.firstName !== undefined) {
      metadata.firstName = body.firstName;
    }
    if (body.lastName !== undefined) {
      metadata.lastName = body.lastName;
    }
    if (body.preferredCommunicationStyle !== undefined) {
      metadata.preferredCommunicationStyle = body.preferredCommunicationStyle;
    }

    return this.authService.register(body.email, body.password, {
      ...metadata
    });
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken);
  }

  @Post('phone/request-otp')
  async requestPhoneOtp(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RequestPhoneOtpDto
  ) {
    return this.authService.requestPhoneVerificationOtp(user.userId, body.phoneNumber);
  }

  @Post('phone/verify-otp')
  async verifyPhoneOtp(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: VerifyPhoneOtpDto
  ) {
    return this.authService.verifyPhoneOtp(user.userId, body.phoneNumber, body.otp);
  }
}

