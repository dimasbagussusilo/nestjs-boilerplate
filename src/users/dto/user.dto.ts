import { Exclude, Expose } from 'class-transformer';
import { RoleDto } from '../../roles/dto/role.dto';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  roles: RoleDto[];
}
