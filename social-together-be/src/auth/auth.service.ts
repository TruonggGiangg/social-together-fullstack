import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '@users/dto/create-user.dto';
import { iUser } from '@users/user.interface';
import { UsersService } from '@users/users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private readonly configService: ConfigService // ConfigService should be injected here if needed
    ) { }


    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (!user) {
            return null;
        }
        const isMatch = await this.usersService.isValidPass(pass, user.password);
        if (isMatch) {
            return user;
        } else {
            return null;
        }
    }

    async validateOAuthLogin(user: iUser) {
        const payload = { name: user.name, email: user.email, role: "USER" };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'), // Lấy secret từ config
            expiresIn: this.configService.get<string>('JWT_EXPIRE') || '15m' // Thời gian hết hạn của access token
        });

        const refreshToken = await this.createRefreshToken(payload);


        return {
            accessToken,
            refreshToken,
            ...payload
        };
    }

    async login(user: any, res: Response) {

        const payload = {
            email: user.email,
            _id: user._id,
            role: user.role,
            name: user.name
        };

        const refreshToken = await this.createRefreshToken(payload);

        console.log('refreshToken', refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: Number(ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')))

        });

        await this.usersService.updateUserToken(user._id, refreshToken);



        // Set the refresh token as a cookie

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'), // Lấy secret từ config
            expiresIn: this.configService.get<string>('JWT_EXPIRE') || '15m' // Thời gian hết hạn của access token
        });

        return {
            accessToken,
            refreshToken,
            ...payload
        };
    }

    async register(user: RegisterUserDto) {

        const newUser = { ...user, role: 'USER' };


        const result = await this.usersService.register(newUser);

        return result;

    }

    createRefreshToken = async (payload: any) => {
        const refreshToken = this.jwtService.sign(payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Lấy secret từ config
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE') // Thời gian hết hạn của refresh token
            }
        );
        return refreshToken;

    }

    refreshToken = async (refreshToken: string, res: Response) => {

        try {
            if (!refreshToken) {
                throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại");
            }

            const user = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            console.log('user', user);

            let userInDB = await this.usersService.findOneByRefreshToken(refreshToken);

            console.log('userInDB', userInDB);

            if (!userInDB) {
                throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại");
            } else {
                //update refresh token
                const newRefreshToken = await this.createRefreshToken({
                    email: userInDB.email,
                    _id: userInDB._id,
                    role: userInDB.role,
                    name: userInDB.name,
                });


                // Cập nhật cookie với refresh token mới
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false, // chỉ đặt true khi chạy trên HTTPS
                    maxAge: Number(ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))) // Convert string to milliseconds
                });

                const accessToken = this.jwtService.sign({
                    _id: userInDB._id,
                    email: userInDB.email,
                    role: userInDB.role,
                    name: userInDB.name
                }, {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_EXPIRE') || '15m',
                });

                // Cập nhật refresh token vào DB
                await this.usersService.updateUserToken(userInDB._id.toString(), newRefreshToken);

                return {
                    accessToken: accessToken,
                    _id: userInDB._id,
                    email: userInDB.email,
                    role: userInDB.role,
                    name: userInDB.name
                }

            }


        } catch (error) {
            console.error('Refresh token error:', error?.message || error);
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token đã hết hạn, vui lòng đăng nhập lại');
            }
            throw new UnauthorizedException('Token không hợp lệ');
        }


    }



    logout = async (user: iUser, res: Response) => {
        res.clearCookie('refreshToken');
        return await this.usersService.updateUserToken(user._id, '');
    }
}
