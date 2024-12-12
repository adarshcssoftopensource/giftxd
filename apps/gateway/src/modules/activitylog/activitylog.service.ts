import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from '@app/schemas/activities';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityLogModel: Model<Activity>,
  ) {}

  async logActivity(activityLog: Activity) {
    const createdActivityLog = new this.activityLogModel(activityLog);
    return createdActivityLog.save();
  }

  async getActivityLogs(): Promise<Activity[]> {
    return this.activityLogModel.find().exec();
  }
}
