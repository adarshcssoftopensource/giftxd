import {
  Controller,
  Post,
} from '@nestjs/common';
import { CoinMakerService } from './coin-maker.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@Controller('coinMaker')
@ApiTags('coinMaker')
export class coinMakerController {
  constructor(private readonly coinMakerService: CoinMakerService) {}

  @Post('/price')
  @ApiExcludeEndpoint()
  async coinMaker(){
    return this.coinMakerService.coinMaker();
  }
}
