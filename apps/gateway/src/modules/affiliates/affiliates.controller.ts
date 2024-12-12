import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { AffiliatesService } from './affiliates.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';

@Controller('affiliate')
@ApiTags('affiliate')
@ApiExcludeController()
export class AffiliatesController {
  constructor(private affiliateService: AffiliatesService) {}
  @Post('/create')
  @ResponseMessage('affiliate created')
  @UseInterceptors(ResponseInterceptor)
  createAffiliate(@Body() model: USER_DTOS.CreateAffiliateDto) {
    return this.affiliateService.createAffiliate(model);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllAffiliate(@Query() query: USER_DTOS.AffiliatePagingQueryDto) {
    return this.affiliateService.getAllAffiliate(query);
  }
  @Get('/getById/:id')
  @ResponseMessage('data fetch')
  @UseInterceptors(ResponseInterceptor)
  getByIdAffiliate(@Param('id') id: string) {
    return this.affiliateService.getByIdAffiliate(id);
  }
  @Put('/update/:id')
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateaffiliate(
    @Param('id') id: string,
    model: USER_DTOS.UpdateAffiliateDto,
  ) {
    return this.affiliateService.updateAffiliate(id, model);
  }
  @Delete('/delete/:id')
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  deleteAffiliate(@Param('id') id: string) {
    return this.affiliateService.deleteAffiliate(id);
  }
}
