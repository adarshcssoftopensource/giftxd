import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private vedorService: VendorService) {}

  @MessagePattern('vendor.create')
  createvendor({ token }: { token: string }) {
    try {
      const data = this.vedorService.createVendor(token);
      return data;
    } catch (error) {
      console.log('errr', error);
    }
  }
  @MessagePattern('vendor.getById')
  async getBYIdVendor(id: string) {
    const data = await this.vedorService.getBYIdVendor(id);
    return data;
  }
}
