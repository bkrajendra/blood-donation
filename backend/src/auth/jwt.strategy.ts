import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secretKey", // Use env variable in production
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, mobile: payload.mobile, role: payload.role };
  }
  //     async validate(username: string, password: string): Promise<any> {
  //     const user = await this.authService.validateUser(username, password);
  //     if (!user) {
  //       throw new UnauthorizedException();
  //     }
  //     return user;
  //   }
}
