import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createRole(name: string, description: string): Promise<Role> {
    const role = this.roleRepository.create({ name, description });
    return await this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async associatePermissionsWithRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    role.permissions = permissions;

    await this.roleRepository.save(role);
  }

  async associateUsersWithRole(
    roleId: number,
    userIds: number[],
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    role.users = users;

    await this.roleRepository.save(role);
  }
}
