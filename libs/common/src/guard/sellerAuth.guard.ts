import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminService } from 'apps/gateway/src/modules/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
@Injectable()
export class SellerAuthGuard implements CanActivate {
  constructor(
    private readonly admin_service: AdminService,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any | Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-access-token'];
    if (!token) {
      throw new HttpException(
        {
          isSuccess: false,
          message: [
            {
              type: 'header',
              value: token,
              msg: 'token is required',
              path: 'token',
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const token_verify_promise = (
        token: string,
      ): Promise<[Error | null, Record<string, any> | null]> =>
        new Promise((resolve) => {
          const xxx = this.admin_service.tokenVerify(token).subscribe({
            next: function (data) {
              resolve(data);
            },
          });
        });
      const [err, user] = await token_verify_promise(token);
      if (
        user.role.name !== roleType.Client ||
        user.role.name !== roleType.Vendor
      ) {
        throw new HttpException(
          {
            isSuccess: false,
            message: [
              {
                type: 'header',
                value: token,
                msg: 'token is required',
                path: 'token',
              },
            ],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (err) {
        throw new HttpException(
          {
            isSuccess: false,
            message: [
              {
                type: 'header',
                value: token,
                msg: err.message,
                path: 'token',
              },
            ],
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      request['user'] = user;
      const decode: any = this.jwt.decode(token);
      const twoFaVerified = decode.twoFaVerified;
      console.log(decode.twoFaVerified, decode._id, '>>>>>>token>2>>>>>>');
      console.log(user, '>>>>>>user2>>>>>>>');
      if (twoFaVerified) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new HttpException(
        {
          isSuccess: false,
          message: [
            {
              type: 'header',
              value: token,
              msg: err.message,
              path: 'token',
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
