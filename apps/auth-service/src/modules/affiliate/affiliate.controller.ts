import { MessagePattern } from '@nestjs/microservices';
import { AffiliateService } from './affiliate.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('affiliates')
export class AffiliateController {
  constructor(private affiliateService: AffiliateService) {}

  @MessagePattern('affiliate.create')
  createAffiliate(model: USER_DTOS.CreateAffiliateDto) {
    const data = this.affiliateService.createAffiliate(model);
    return data;
  }
  @MessagePattern('affiliate.update')
  updateAffiliate(model: USER_DTOS.UpdateAffiliateDto, id: string) {
    const data = this.affiliateService.updateAffiliate(id, model);
    return data;
  }
  @MessagePattern('affiliate.getAll')
  async getAllAffiliate(query: USER_DTOS.AffiliatePagingQueryDto) {
    const data = await this.affiliateService.getAllAffiliate(query);
    return data;
  }
  @MessagePattern('affiliate.getById')
  async getBYIdAffiliate(id: string) {
    const data = await this.affiliateService.getBYIdAffiliate(id);
    return data;
  }
  @MessagePattern('affiliate.deleteById')
  async deleteAffiliate(id: string) {
    const data = await this.affiliateService.deleteAffiliate(id);
    return data;
  }
}
