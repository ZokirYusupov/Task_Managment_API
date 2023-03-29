import { AuthService } from './auth.service';
import { Body, Controller, Post, } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth.credentials.dto";


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {

  }
  @Post('signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto)
  }

  @Post('signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto)
  }


}