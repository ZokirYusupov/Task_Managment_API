import { JwtPayload } from './jwt.payload.interface';
import { User } from './user.entity';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      secretOrKey: 'topSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate (payload: JwtPayload) {
    const { username } = payload
    const user: User = await this.userRepo.findOne({
      where: {
        username
      }
    })

    if(!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}