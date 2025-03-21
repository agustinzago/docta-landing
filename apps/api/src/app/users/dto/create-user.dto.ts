import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  salt?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsEmail()
  googleEmail?: string;

  @IsOptional()
  @IsString()
  credits?: string;

  @IsOptional()
  @IsString()
  googleResourceId?: string;

  @IsOptional()
  @IsString()
  localGoogleId?: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  logedFirstTime?: boolean;
}
