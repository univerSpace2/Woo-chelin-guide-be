import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;

  @IsString({ message: '익명 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '익명 이름은 필수 입력 항목입니다.' })
  anonymousName: string;
}
