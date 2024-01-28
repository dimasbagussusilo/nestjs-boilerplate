import { Body, Controller, Get, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const { name, description } = createPermissionDto;
    return await this.permissionService.createPermission(name, description);
  }

  @Get()
  async getAllPermissions() {
    return await this.permissionService.findAllPermissions();
  }
}
