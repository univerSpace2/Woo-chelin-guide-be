import { Global, Module } from '@nestjs/common';
import { JwtModule } from './modules/jwt.module';

@Global()
@Module({
  imports: [JwtModule],
  exports: [JwtModule],
})
export class CommonModule {}
