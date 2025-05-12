import { Injectable, UnauthorizedException, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('JWT_SECRET') private jwtSecret: string
  ) {
    this.logger.log('Auth service initialized');
  }

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`);
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      this.logger.log(`User ${username} validated successfully`);
      return result;
    }
    this.logger.warn(`Invalid credentials for user: ${username}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(`Generating token for user: ${user.username}`);
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload, { secret: this.jwtSecret });
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(user: any) {
    this.logger.log(`Refreshing token for user: ${user.username}`);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: this.jwtSecret }),
    };
  }
} 