import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  const users: User[] = [];
  const fakeUsersService: Partial<UsersService> = {
    findOne: (id: number) =>
      Promise.resolve(users.filter((user) => user.id === id))[0],
    find: (email) =>
      Promise.resolve(users.filter((user) => user.email === email)),
    create: (email: string, password: string) => {
      const user = {
        id: Math.floor(Math.random() * 99999),
        email,
        password,
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
  };

  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await authService.signup('dbs@gmail.com', 'Password123!!!');

    expect(user.password).not.toEqual('Password123!!!');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await authService.signup('dimas@gmail.com', 'Password123!!!');

    await expect(
      authService.signup('dimas@gmail.com', 'Password123!!!'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      authService.login('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(BadRequestException);

    await expect(
      authService.login('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow('invalid email or password');
  });

  it('successful login with valid credentials', async () => {
    const user = await authService.signup(
      'dimas.susilo@gmail.com',
      'Password123!!!',
    );

    await expect(
      authService.login('dimas.susilo@gmail.com', 'Password123!!!'),
    ).resolves.toBe(user);
  });
});
