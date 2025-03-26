import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() request: Express.Request): Promise<User> {
    const user = request['user'] as User;
    return this.userService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Express.Request
  ): Promise<User> {
    // Verificar que el usuario solo pueda modificar su propio perfil
    const user = request['user'] as User;
    if (user.id !== id) {
      throw new BadRequestException('You can only update your own profile');
    }

    // Verificar si el email ya está en uso
    if (updateUserDto.email) {
      const existingUser = await this.userService.findByEmail(
        updateUserDto.email
      );
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request: Express.Request
  ): Promise<{ success: boolean; message: string }> {
    const user = request['user'] as User;
    if (user.id !== id) {
      throw new BadRequestException('You can only delete your own profile');
    }

    await this.userService.remove(id);
    return {
      success: true,
      message: `User with ID ${id} has been successfully deleted`,
    };
  }
}
