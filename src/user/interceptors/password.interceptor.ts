import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';

import { map } from 'rxjs/operators';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const excludePass = (item) => {
          const { password, ...res } = item;
          return res;
        };
        if (Array.isArray(data)) {
          return data.map((el) => (el?.password ? excludePass(el) : el));
        }
        return data?.password ? excludePass(data) : data;
      }),
    );
  }
}
