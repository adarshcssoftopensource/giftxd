import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HOME_MODELS,
  LINKED_ACCOUNT_LIMIT_MODELS,
  USER_MODELS,
} from '@app/schemas';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { S3Service } from '@app/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Client.name, schema: USER_MODELS.ClientSchema },
      {
        name: HOME_MODELS.PhoneNumber.name,
        schema: HOME_MODELS.PhoneNumberSchema,
      },
      {
        name: LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit.name,
        schema: LINKED_ACCOUNT_LIMIT_MODELS.LinkedAccountSchema,
      },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
      { name: USER_MODELS.Vendor.name, schema: USER_MODELS.VendorSchema },
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService, S3Service],
})
export class VendorModule {}
