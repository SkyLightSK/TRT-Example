import { Injectable, Logger, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private usersService: UsersService,
    @Inject('JWT_SECRET') private jwtSecret: string
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
    this.logger.log('JWT Strategy initialized');
  }

  async validate(payload: any) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);
    
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        this.logger.error(`User with ID ${payload.sub} not found`);
        return null;
      }
      this.logger.log(`User authenticated: ${user.username}`);
      return { id: payload.sub, username: payload.username };
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      return null;
    }
  }
} 