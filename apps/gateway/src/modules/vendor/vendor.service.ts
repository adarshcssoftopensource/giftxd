import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class VendorService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly vendorService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createVendor() {
    const token = this.request.headers['x-access-token'];
    return this.vendorService.send('vendor.create', {
      token,
    });
  }
  getByIdVendor(id: string) {
    return this.vendorService.send('vendor.getById', id);
  }
}
