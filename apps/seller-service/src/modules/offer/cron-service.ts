import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';
import { roleType } from '@app/schemas/users/role.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(USER_MODELS.Client.name)
    private ClientModel: Model<USER_MODELS.Client>,
    @InjectModel(USER_MODELS.User.name)
    private UserModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Role.name)
    private RoleModel: Model<USER_MODELS.Role>,
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
  ) {}
  @Cron('0 0 * * *')
  async handleCron() {
    console.log('=====>>>> Client Cron started <<<<<===========');
    try {
      const role = await this.RoleModel.findOne({ name: roleType.Client });
      if (!role) {
        console.log('Role does not exist =====>>> Client Cron');
        return;
      }
      const allUsers = await this.UserModel.find({ role: role._id });
      for (const user of allUsers) {
        const clientUser = await this.ClientModel.findOne({ user: user._id });
        const phone_number = await this.phoneNumberModel.findOne({
          phoneNumber: user.phone_number,
        });
        if (!clientUser) {
          console.log('Client user does not exist =====>>> Client Cron');
          continue;
        }
        if (!user.email_verified) {
          clientUser.limit = 0;
          clientUser.consumption = 0;
          clientUser.isUnlimited = false;
        }
        if (phone_number && phone_number.isVerified) {
          clientUser.limit = 500;
          clientUser.consumption = 0;
        }

        if (
          clientUser.residency_verif_status == KycVerificationStatus.COMPLETED
        ) {
          clientUser.isUnlimited = true;
          clientUser.limit = 0;
          clientUser.consumption = 0;
        }
        await clientUser.save();
      }
    } catch (error) {
      console.error('An error occurred in Client Cron  @1234532:', error);
    }
  }

  // if want to check if cron is working properly can test from here ===>>>
  // @Cron('*/10 * * * * *')
  // async handleCron() {
  //   try {
  //     console.log('=====>>>> Client Cron started <<<<<===========');
  //     const role = await this.RoleModel.findOne({ name: roleType.Client });
  //     if (!role) return;

  //     const userIdToTest = 'userId to test';
  //     const user = await this.UserModel.findById(userIdToTest);
  //     if (!user) return;

  //     const clientUser = await this.ClientModel.findOne({ user: user._id });
  //     const phone_number = await this.phoneNumberModel.findOne({
  //       phoneNumber: user.phone_number,
  //     });

  //     if (!clientUser) return;

  //     if (!user.email_verified) {
  //       clientUser.limit = 0;
  //       clientUser.consumption = 0;
  //       clientUser.isUnlimited = false;
  //     }

  //     if (phone_number && phone_number.isVerified) {
  //       clientUser.limit = 500;
  //       clientUser.consumption = 0;
  //     }

  //     if (
  //       clientUser.residency_verif_status === KycVerificationStatus.COMPLETED
  //     ) {
  //       clientUser.isUnlimited = true;
  //       clientUser.limit = 0;
  //       clientUser.consumption = 0;
  //     }
  //     console.log('=====>>>> Client Cron finished <<<<<===========');
  //     await clientUser.save();
  //   } catch (error) {
  //     console.error('An error occurred in Client Cron:', error);
  //   }
  // }
}
