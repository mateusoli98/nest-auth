import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthResponse } from './dto/auth.response';

const scrypt = promisify(_scrypt);

const users = [];

@Injectable()
export class AuthService {
  async signUp(email: string, password: string) {
    const user = users.find((x) => x.email === email);

    if (user) {
      return new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const salt_hash = salt.concat('.').concat(hash.toString('hex'));

    users.push({ email, password: salt_hash });
  }

  async signIn(email: string, password: string): Promise<AuthResponse | UnauthorizedException> {
    const user = users.find((x) => x.email === email);

    if (!user) {
      return new UnauthorizedException('Invalid credentials');
    }

    const [salt, storeHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storeHash != hash.toString('hex')) {
      return new UnauthorizedException('Invalid credentials');
    }

    return { email };
  }
}
