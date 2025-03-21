import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

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
  googleId?: string;

  @IsOptional()
  @IsEmail()
  googleEmail?: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  googleResourceId?: string;

  @IsOptional()
  @IsString()
  localGoogleId?: string;

  @IsOptional()
  @IsString()
  credits?: string;

  @IsOptional()
  @IsBoolean()
  logedFirstTime?: boolean;

  salt?: string;
}
