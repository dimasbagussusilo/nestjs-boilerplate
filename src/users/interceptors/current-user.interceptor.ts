import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

// NO LONGER USED BECAUSE OF LIFECYCLE ISSUE
////////////////////////////////////////////
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (!userId) {
      return handler.handle();
    }

    request.currentUser = await this.usersService.findOne(userId);
    return handler.handle();
  }
}
