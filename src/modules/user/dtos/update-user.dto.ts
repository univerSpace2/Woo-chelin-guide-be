import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsOptional()
  email?: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @IsOptional()
  password?: string;

  @IsString({ message: '익명 이름은 문자열이어야 합니다.' })
  @IsOptional()
  anonymousName?: string;
}
