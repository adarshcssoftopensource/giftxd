import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { HOME_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(HOME_MODELS.SettingsCard.name)
    private settingsCardModel: Model<HOME_MODELS.SettingsCard>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
  ) {}

  async getSettingsById(userId: string): Promise<USER_MODELS.User> {
    try {
      const userWithSettings = await this.userModel
        .findById(userId)
        .populate('settings') // Make sure 'settings' matches the field name in the User schema
        .exec();
      console.log('User with populated settings:', userWithSettings);

      if (!userWithSettings) {
        console.error('User not found for ID:', userId);
        throw new RpcException('User not found');
      }

      return userWithSettings;
    } catch (error) {
      console.error('Error fetching user and settings:', error);
      throw new RpcException('Error fetching user and settings');
    }
  }

  async updateSettings(
    userId: string,
    updateDto: HOME_DTOS.UpdateSettingsDto,
  ): Promise<HOME_MODELS.SettingsCard> {
    // Log the userId for debugging
    console.log('Updating settings for user ID:', userId);

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      console.error('User not found for ID:', userId);
      throw new RpcException('User not found');
    }

    // Log the user's settings ID for debugging
    console.log('Found user, settings ID:', user.settings);

    if (!user.settings) {
      throw new RpcException('Settings Card not found for this user');
    }

    let settingsCard = await this.settingsCardModel
      .findById(user.settings)
      .exec();
    if (!settingsCard) {
      console.error('Settings Card not found for ID:', user.settings);
      throw new RpcException('Settings Card not found');
    }

    // Log the settings card for debugging
    console.log('Found settings card:', settingsCard);

    Object.entries(updateDto).forEach(([key, value]) => {
      if (value !== undefined) {
        settingsCard[key] = value;
        settingsCard[`${key}_last_updated`] = new Date();
      }
    });

    await settingsCard.save();
    return settingsCard;
  }

  // async getTimezones(): Promise<any> {
  //   return moment.tz.names();
  // }
}
