import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from '@app/schemas/users/profile.schema';
import {
  UserProfileCreateDto,
  UserProfileUpdateDto,
} from '@app/dto/users/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfile>,
  ) {}

  async createProfile(dto: UserProfileCreateDto): Promise<UserProfile> {
    const profile = await new this.userProfileModel(dto).save();
    return profile;
  }

  async getProfiles(): Promise<UserProfile[]> {
    return this.userProfileModel.find().exec();
  }

  async getProfileById(id: string): Promise<UserProfile> {
    return this.userProfileModel.findById(id).exec();
  }

  async updateProfile(
    id: string,
    dto: UserProfileUpdateDto,
  ): Promise<UserProfile> {
    const profile = await this.userProfileModel.findById(id).exec();

    if (!profile) {
      // Handle not found
    }

    // Update profile fields based on dto

    await profile.save();
    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    await this.userProfileModel.findByIdAndDelete(id).exec();
  }
}
