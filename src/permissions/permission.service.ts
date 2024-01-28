import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(
    name: string,
    description: string,
  ): Promise<Permission> {
    const permission = this.permissionRepository.create({
      name,
      description,
    });
    return await this.permissionRepository.save(permission);
  }

  async findAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }
}
