import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "@auth/auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // Hàm validate sẽ được gọi khi người dùng đăng nhập
  // Passport sẽ tự động lấy username và password từ body của request
  // Nếu xác thực thành công, hàm này sẽ trả về thông tin người dùng
  // Nếu xác thực thất bại, sẽ ném ra UnauthorizedException
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}