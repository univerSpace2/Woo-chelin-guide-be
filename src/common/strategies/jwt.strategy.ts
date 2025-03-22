import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    // 여기서 payload를 검증하고 사용자 정보를 반환합니다.
    // 실제 구현에서는 사용자 서비스를 통해 데이터베이스에서 사용자를 조회할 수 있습니다.
    if (!payload.sub) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
