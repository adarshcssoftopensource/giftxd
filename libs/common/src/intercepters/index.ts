import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    const responseMessage =
      this.reflector.get<string>('message', context.getHandler()) ?? '';
    return next.handle().pipe(
      map((data) => {
        if (data['error']) {
          const errCode = data['error']['errorCode'];
          const errorMessage = data['error']['message'];
          response.status(errCode ?? 400).json({
            isSuccess: false,
            statusCode: errCode ?? 400,
            error: data['message'],
            message: errorMessage ?? data['error'],
          });
        } else {
          response.status(response.statusCode ?? 200).json({
            isSuccess: true,
            data: data,
            statusCode: response.statusCode,
            message: responseMessage ?? '',
          });
        }
      }),
    );
  }
}

@Injectable()
export class MessageResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data['error']) {
          const errCode = data['error']['errorCode'];
          const errorMessage = data['error']['message'];
          response.status(errCode ?? 400).json({
            isSuccess: false,
            statusCode: errCode ?? 400,
            error: data['message'],
            message: errorMessage ?? data['error'],
          });
        } else {
          response.status(response.statusCode ?? 200).json({
            isSuccess: true,
            statusCode: response.statusCode,
            message: data ?? '',
          });
        }
      }),
    );
  }
}
console.log();

@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body && req.file?.fieldname) {
      const { fieldname } = req.file;
      if (!req.body[fieldname]) {
        req.body[fieldname] = req.file;
      }
    }

    return next.handle();
  }
}