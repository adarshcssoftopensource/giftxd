import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODELS.Supervisor.name,
        schema: USER_MODELS.SupervisorSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
    ]),
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
