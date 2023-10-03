import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserEntity } from 'src/user/model';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async generateJWT(user: User) {
    const jwt = await this.jwtService.signAsync({ user });
    return jwt;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(newPassword: string, passwortHash: string) {
    return await bcrypt.compare(newPassword, passwortHash);
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    // Find the user by their email address in the database
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const resetToken = Math.floor(Math.random() * 10000000).toString();
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1);
      await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          resetToken,
          resetTokenExpiration: tokenExpiration,
        })
        .where('id = :id', { id: user.id })
        .execute();

      console.log(resetToken);
      return resetToken;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          resetToken: token,
        },
      });

      if (!user) throw new BadRequestException('Invalid Data');

      if (new Date() > user.resetTokenExpiration)
        throw new BadRequestException('Invalid Token Date');
      const hashPassword = await this.hashPassword(password);

      await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          password: hashPassword,
          resetToken: '',
        })
        .where('id = :id', { id: user.id })
        .execute();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
