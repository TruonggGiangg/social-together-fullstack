import { AppService } from './app.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '@auth/guard/local-guard.strategy';
import { AuthService } from '@auth/auth.service';
import { JwtAuthGuard } from '@auth/guard/jwt-guard.strategy';
import { Public, ResponseMessage, User } from '@decorator/customize';
import { RegisterUserDto } from '@users/dto/create-user.dto';
import type { iUser } from '@users/user.interface';
import type { Request, Response } from 'express';
import { GoogleAuthGuard } from '@auth/guard/google-guard.strategy';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

   //luồn login
  //1: Sử dụng LocalAuthGuard để xác thực người dùng
  //2: Nếu xác thực thành công, nhảy vào login trong AuthService ký phần mà LocalAuthGuard trả về
  //3: Trả về access_token cho người dùng
  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản' })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công.' })
  @ApiBody({ type: RegisterUserDto })
  @Public()
  @ResponseMessage("Login")
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(req.user, res);
  }



  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Không cần xử lý gì — Passport sẽ redirect sang Google
  }


  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    const payloadAndToken = await this.authService.validateOAuthLogin(req.user as iUser);
    return {
      message: 'Đăng nhập Google thành công',
      user: {
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
      },
      ...payloadAndToken,
    };
  }


  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công.' })
  @ApiBody({ type: RegisterUserDto })
  @Public()
  @ResponseMessage("Register")
  @Post('register')
  handleRegister(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }


  // @Public()
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ResponseMessage("Get account")
  getProfile(@Req() req: Request) {
    return req.user;
  }



  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công.' })
  @Get('account')
  @ResponseMessage("Get account")
  getAccount(@User() user: iUser) {
    return {
      ...user
    };
  }


  @Public()
  @Post('refresh')
  @ResponseMessage("Refresh token")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies['refreshToken'];
    return await this.authService.refreshToken(refreshToken, res);
  }



  @ResponseMessage("Logout")
  @Post('logout')
  async logout(
    @User() user: iUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.logout(user, res);
  }
}
