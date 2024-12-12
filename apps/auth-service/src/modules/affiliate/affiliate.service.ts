import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/affiliate';

const toObjectId = Types.ObjectId;
@Injectable()
export class AffiliateService {
  constructor(
    @InjectModel(USER_MODELS.Affiliate.name)
    private affiliateModel: Model<USER_MODELS.Affiliate>,
  ) {}

  async createAffiliate(model: USER_DTOS.CreateAffiliateDto) {
    const isExist = await this.affiliateModel.findOne({
      email: model.email,
    });
    if (isExist) {
      throw new RpcException('Affiliate already exist');
    }

    const affiliate_payload = {
      user_name: model.user_name,
      full_name: model.full_name,
      email: model.email,
      company_name: model.company_name,
      total_payouts: model.total_payouts,
      payment_method: model.payment_method,
      date_onboarded: model.date_onboarded,
    };
    const affiliate = await new this.affiliateModel({
      ...affiliate_payload,
    }).save();

    return affiliate;
  }

  async getAllAffiliate(query: USER_DTOS.AffiliatePagingQueryDto) {
    const page_number = Number(query.page_number);
    const page_size = Number(query.page_size);
    const skip = (page_number - 1) * page_size;
    const totalAffiliates = await this.affiliateModel.countDocuments();
    const total_pages = Math.ceil(totalAffiliates / page_size);
    if (page_number > total_pages) {
      return new RpcException('Invalid page number');
    }
    const affiliates = await this.affiliateModel
      .find()
      .skip(skip)
      .limit(page_size)
      .exec();
    if (affiliates?.length === 0) {
      return new RpcException('affiliates not available');
    }
    return {
      affiliates: toSearchModel(affiliates),
      current_page: page_number,
      total_pages: total_pages,
    };
  }

  async getBYIdAffiliate(id: string) {
    const affiliate = await this.affiliateModel.findOne({
      _id: new toObjectId(id),
    });
    if (!affiliate) {
      return new RpcException('affiliate not available');
    }
    return toModel(affiliate);
  }

  async updateAffiliate(id: string, model: USER_DTOS.UpdateAffiliateDto) {
    const affiliate = await this.affiliateModel.findById;
    if (!affiliate) {
      throw new RpcException('affiliate not found');
    }
  }

  async deleteAffiliate(id: string) {
    const affiliate = await this.affiliateModel.findByIdAndDelete(id);
    if (!affiliate) {
      return new RpcException('affiliate not found');
    }

    return 'affiliate deleted';
  }
}
