import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let users: User[] = [];
  const fakeUsersService: Partial<UsersService> = {
    findOne: (id: number) => {
      return Promise.resolve(users.filter((user) => user.id === id)[0]);
    },
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
    async remove(id: number): Promise<User> {
      const user = users.filter((user) => user.id === id)[0];
      users = users.filter((user) => user.id !== id);
      return Promise.resolve(user);
    },
    async update(id: number, attrs: Partial<User>): Promise<User> {
      const user = users.filter((user) => user.id === id)[0];
      users = users.filter((user) => user.id !== id);
      Object.assign(user, attrs);
      users.push(user);
      return Promise.resolve(user);
    },
  };

  const fakeAuthService: Partial<AuthService> = {
    // async signup(email: string, password: string): Promise<User> {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(email: string, password: string): Promise<User> {
      const [user] = await fakeUsersService.find(email);

      if (!user) {
        throw new BadRequestException('invalid email or password');
      }

      // const [salt, hashedPassword] = user.password.split('.');
      //
      // const hashPassword = (await scrypt(password, salt, 32)) as Buffer;
      //
      // if (hashedPassword !== hashPassword.toString('hex')) {
      //   throw new BadRequestException('invalid email or password');
      // }

      return user;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    await expect(controller.findUser('999')).rejects.toThrow(NotFoundException);
  });

  it('findUser success if user with given id is found', async () => {
    users.push({ id: 1, email: 'dimas@gmail.com' } as User);
    await expect(controller.findUser('1')).resolves.toEqual({
      id: 1,
      email: 'dimas@gmail.com',
    });
  });

  it('findAllUser return all users with given email', async () => {
    users.push({ id: 989, email: 'dbs@gmail.com' } as User);
    await expect(controller.findAllUsers('dbs@gmail.com')).resolves.toEqual([
      {
        id: 989,
        email: 'dbs@gmail.com',
      },
    ]);
  });

  it('login updates session object and returns user', async () => {
    const session = { userId: 0 };

    users.push({ id: 889, email: 'dbsSensei@gmail.com' } as User);

    const user = await controller.loginUser(
      { email: 'dbsSensei@gmail.com', password: 'password' },
      session,
    );

    expect(user.email).toEqual('dbsSensei@gmail.com');
    expect(session.userId).toEqual(889);
  });
});
