import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt(8);
    const hashedPwd = await bcrypt.hash(password, salt);
    console.log(hashedPwd);

    const user = this.userRepo.create({ username, password: hashedPwd });

    try {
      await this.userRepo.save(user);

      return user;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
      // console.log(error);
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepo.findOne({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accesToken: string = await this.jwtService.sign(payload);
      return {
        accesToken,
      };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
