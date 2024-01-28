import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssociatePermissionsDto } from './dto/associate-permissions.dto';
import { AssociateUsersDto } from './dto/associate-users.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const { name, description } = createRoleDto;
    return await this.roleService.createRole(name, description);
  }

  @Get()
  async getAllRoles() {
    return await this.roleService.findAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') roleId: string) {
    return await this.roleService.findRoleById(+roleId);
  }

  @Post(':id/permissions/associate')
  async associatePermissionsWithRole(
    @Param('id') roleId: string,
    @Body() associatePermissionsDto: AssociatePermissionsDto,
  ): Promise<void> {
    const { permission_ids } = associatePermissionsDto;
    await this.roleService.associatePermissionsWithRole(
      +roleId,
      permission_ids,
    );
  }

  @Post(':id/users/associate')
  async associateUsersWithRole(
    @Param('id') roleId: string,
    @Body() associateUsersDto: AssociateUsersDto,
  ): Promise<void> {
    const { user_ids } = associateUsersDto;
    await this.roleService.associateUsersWithRole(+roleId, user_ids);
  }
}
