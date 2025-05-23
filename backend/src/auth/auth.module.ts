import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

// Use a consistent secret key
const JWT_SECRET = 'your_secure_jwt_secret_key_for_development';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    {
      provide: 'JWT_SECRET',
      useValue: JWT_SECRET,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 