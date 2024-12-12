import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.Affiliate.name, schema: USER_MODELS.AffiliateSchema },
    ]),
  ],
  controllers: [AffiliateController],
  providers: [AffiliateService],
})
export class AffiliateModule {}
