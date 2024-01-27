import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');
    return await this.usersService.create(email, hashedPassword);
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new BadRequestException('invalid email or password');
    }

    const [salt, hashedPassword] = user.password.split('.');

    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword !== hashPassword.toString('hex')) {
      throw new BadRequestException('invalid email or password');
    }

    return user;
  }
}
