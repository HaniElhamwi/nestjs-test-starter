import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserEntity } from './model';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { ProductService } from 'src/products/products.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private mailService: MailService,
    private productService: ProductService,
  ) {}

  //  singup functionality

  async signup(user: User) {
    try {
      const userData = new UserEntity();
      userData.companyName = user.companyName;
      userData.companyTaxNumber = user.companyTaxNumber;
      userData.email = user.email;
      userData.password = user.password;
      userData.phoneNumber = user.phoneNumber;
      userData.username = user.username;
      userData.website = user.website;
      userData.role = user.role;
      const hashedPassword = await this.authService.hashPassword(user.password);
      userData.password = hashedPassword;
      await this.userRepository.save(userData);
      await this.mailService.sendUserConfirmation(userData);
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  // login functionality

  async login(email: string, password: string) {
    // find user if exist
    const findUser = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'username',
        'companyName',
        'verified',
        'companyTaxNumber',
      ],
    });

    if (!findUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    // validate user
    const passwordIsValid = await this.authService.comparePasswords(
      password,
      findUser.password,
    );

    if (!passwordIsValid)
      throw new HttpException('password is wrong', HttpStatus.BAD_REQUEST);

    delete findUser.password;

    // generate token
    const token = await this.authService.generateJWT(findUser);

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ refreshToken: token })
      .where('id = :id', { id: findUser.id })
      .execute();
    return { token, user: findUser };
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return user;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async refreshTokenHandler({ token }: { token: string }) {
    if (!token)
      throw new HttpException('user not authorized', HttpStatus.UNAUTHORIZED);
    try {
      const user = await this.userRepository.findOne({
        where: { refreshToken: token },
        select: [
          'id',
          'email',
          'username',
          'companyName',
          'verified',
          'companyTaxNumber',
        ],
      });

      if (!user)
        throw new HttpException('user not authorized', HttpStatus.UNAUTHORIZED);
      const refreshToken = await this.authService.generateJWT(user);
      await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ refreshToken })
        .where('id = :id', { id: user.id })
        .execute();

      return { refreshToken, user };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
