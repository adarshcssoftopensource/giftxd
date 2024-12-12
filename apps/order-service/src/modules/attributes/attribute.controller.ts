import { MessagePattern } from '@nestjs/microservices';
import { AttributeService } from './attribute.service';
import { Controller } from '@nestjs/common';
import { ATTRIBUTE_DTOS } from '@app/dto';

@Controller('attribute')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @MessagePattern('attribute.create')
  async createAttribute(model: ATTRIBUTE_DTOS.CreateAttribueDto) {
    const data = await this.attributeService.createAttribute(model);
    return data;
  }

  @MessagePattern('attribute.getAll')
  async attributeetAll(model: ATTRIBUTE_DTOS.queryatributeDto) {
    const data = await this.attributeService.getAllAttribute(model);
    return data;
  }

  @MessagePattern('attribute.deleteById')
  async deleteAttribute(id: string, token:string) {
    const attribute = await this.attributeService.deleteAttribute(id, token);
    return attribute;
  }
}
