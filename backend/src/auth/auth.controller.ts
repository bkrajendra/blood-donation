import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post("login")
  async login(@Body() body: { mobile: string; password: string }) {
    const user = await this.authService.validateUser(
      body.mobile,
      body.password
    );
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return this.authService.login(user);
  }
  // @Post("register")
  // async register(@Body() body: { mobile: string; password: string }) {
  //   const passwordHash = await bcrypt.hash(body.password, 10);
  //   return this.usersService.update({body.mobile, passwordHash); // default role = 'bd_user'
  // }
}
