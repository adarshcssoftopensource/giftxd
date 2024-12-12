import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { USER_MODELS } from '@app/schemas';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
