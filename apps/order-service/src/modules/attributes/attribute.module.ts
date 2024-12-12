import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ATTRIBUTE_MODEL, PROVIDER_MODEL, USER_MODELS } from '@app/schemas';
import { TCPConnectionModule } from '@app/common';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ATTRIBUTE_MODEL.Attribute.name,
        schema: ATTRIBUTE_MODEL.AttributeSchema,
      },
      {
        name: PROVIDER_MODEL.Provider.name,
        schema: PROVIDER_MODEL.ProviderSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
    ]),
    TCPConnectionModule.register('ORDER_CLIENT_SERVICE', {
      portKey: 'ORDER_CLIENT_SERVICE_PORT',
    }),
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
