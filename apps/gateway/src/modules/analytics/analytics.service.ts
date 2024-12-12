import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ORDER_MODELS } from '@app/schemas';

@Injectable()
export class AnalyticsService {
  @InjectModel(ORDER_MODELS.Order.name)
  private orderModel: Model<ORDER_MODELS.Order>;

  public async getMonthlyChange(months: number): Promise<number> {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 2 * months);

    const midDate = new Date(currentDate);
    midDate.setMonth(currentDate.getMonth() - months);

    const newOrders = await this.orderModel
      .find({
        updated_at: { $gte: midDate, $lt: currentDate },
      })
      .exec();

    const oldOrders = await this.orderModel
      .find({
        updated_at: { $gte: startDate, $lt: midDate },
      })
      .exec();

    if (oldOrders.length === 0) {
      return 0; // Avoid division by zero
    }

    return ((newOrders.length - oldOrders.length) / oldOrders.length) * 100;
  }
}
