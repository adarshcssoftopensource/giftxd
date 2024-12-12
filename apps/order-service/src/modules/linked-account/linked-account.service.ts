import { Get, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LINKED_ACCOUNT_DTOS, LINKED_ACCOUNT_LIMIT_DTOS } from '@app/dto';
import {
  LINKED_ACCOUNT_LIMIT_MODELS,
  LINKED_ACCOUNT_MODEL,
  USER_MODELS,
} from '@app/schemas';
import { Model, Types } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
import axios from 'axios';
import {
  decryptData,
  encryptData,
  obfuscateEmail,
} from '@app/common/encryption';
import { ApiType, RequestType } from '@app/schemas/orders';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';

const toObjectId = Types.ObjectId;
@Injectable()
export class LinkedAccountService {
  constructor(
    @InjectModel(LINKED_ACCOUNT_MODEL.LinkedAccount.name)
    private linkedAccountModel: Model<LINKED_ACCOUNT_MODEL.LinkedAccount>,
    @InjectModel(LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit.name)
    private linkedAccountLimitModel: Model<LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
    private giftXdLogService: GiftXdLogsService,
  ) {}

  async createLinkedAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountCreateDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      const linkedAccountLimit = await this.linkedAccountLimitModel.findOne({
        vendor: user._id,
      });
      const userLimit = linkedAccountLimit[model.website];
      const accountsForUserAndWebsite = await this.linkedAccountModel.find({
        vendor: user._id,
        website: model.website,
      });
      if (accountsForUserAndWebsite.length >= userLimit) {
        return new RpcException(
          'This vendor has exceeded the maximum accounts limit.',
        );
      }
    } catch (error) {
      return new RpcException('Something went wrong');
    }
    const encryptEmail = await encryptData(model.email);
    const encryptPassword = await encryptData(model.password);
    try {
      const offer_payload = {
        vendor: user._id,
        website: model.website,
        email: encryptEmail.encryptedData,
        password: encryptPassword.encryptedData,
        emailIv: encryptEmail.iv,
        passwordIv: encryptPassword.iv,
        proxies: model.proxies,
        twoFA: model.twoFA,
        currency: model.currency,
      };
      const account = await new this.linkedAccountModel({
        ...offer_payload,
      }).save();
      let gcrsProxies;
      if (model.proxies) {
        gcrsProxies = {
          country:
            model.proxies.country !== undefined ? model.proxies.country : '',
          state: model.proxies.state !== undefined ? model.proxies.state : '',
          city: model.proxies.city !== undefined ? model.proxies.city : '',
        };
      }
      const payload = {
        username: model.email,
        password: model.password,
        provider: model.website.toUpperCase(),
        proxy: gcrsProxies || {},
      };
      console.log('payload', payload);
      // requestTimeStamp
      payload['requestTimeStamp'] = new Date().toISOString();
      const account_id = account._id;
      const base_url = process.env.BASE_URL_GCRS;
      const apiEndpoint = `${base_url}/gcrs/api/v1/accounts`;
      const urlWithQuery = `${apiEndpoint}?user_id=${account_id}`;
      const options = {
        method: 'POST',
        url: urlWithQuery,
        data: payload,
      };
      const logsPayload = {
        request: options,
        API: ApiType.POST,
        serviceName: 'gcrs',
        requestType: RequestType.Outbound,
        userId: user._id,
      };
      try {
        const response = await axios(options);
        if (response) {
          logsPayload['response'] = response?.data;
          logsPayload['responseTimeStamp'] = new Date().toISOString();
          this.giftXdLogService.createGifXdLogs(logsPayload);
        }
      } catch (error) {
        logsPayload['responseTimeStamp'] = new Date().toISOString();
        logsPayload['exception'] = error?.response?.data;
        this.giftXdLogService.createGifXdLogs(logsPayload);
        console.log('Error while creating account.', error.message);
      }
      return 'Linked Account Created';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }
  async getAllLinkedAccount(
    query: LINKED_ACCOUNT_DTOS.linkedAccountPagingQueryDto,
  ) {
    try {
      const decode: any = this.jwt.decode(query.token);
      const user = await this.userModel.findById(decode._id).populate('role');

      if (!user || user.role.name !== roleType.Vendor) {
        return new RpcException('Invalid user');
      }

      if (user.email_verified !== true) {
        return new RpcException('User is not verified.');
      }
      const linkedAccount = await this.linkedAccountModel.aggregate([
        { $match: { vendor: new Types.ObjectId(user._id) } },
        { $sort: { created_at: -1 } },
        {
          $lookup: {
            from: 'accountlimits',
            localField: 'vendor',
            foreignField: 'vendor',
            as: 'accountLimitInfo',
          },
        },
        {
          $unwind: {
            path: '$accountLimitInfo',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            __v: 0,
            updated_at: 0,
            'proxies._id': 0,
          },
        },
        {
          $group: {
            _id: '$website',
            count: { $sum: 1 },
            accountLimitInfo: { $first: '$accountLimitInfo' },
            linkedAccountInfo: {
              $addToSet: {
                _id: '$_id',
                email: '$email',
                created_at: '$created_at',
                giftXD_limit: '$giftXD_limit',
                consumption: '$consumption',
                proxies: '$proxies',
                emailIv: '$emailIv',
                currency: '$currency',
                externalId: '$externalId',
              },
            },
          },
        },
        {
          $project: {
            'accountLimitInfo._id': 0,
            'accountLimitInfo.vendor': 0,
          },
        },
      ]);
      linkedAccount.forEach((account) => {
        const accountInfo = account.linkedAccountInfo;

        accountInfo.forEach(async (linkedInfo) => {
          const email = linkedInfo.email;
          const encryptedData = {
            iv: linkedInfo.emailIv,
            encryptedData: email,
          };
          const decryptedEmail = await decryptData(encryptedData);
          const hiddenEmail = obfuscateEmail(decryptedEmail);
          linkedInfo.email = hiddenEmail;
          linkedInfo.externalId = linkedInfo.externalId ? true : false;
          delete linkedInfo.emailIv;
        });
      });

      const data = linkedAccount;

      const transformedData = data.reduce((acc, item) => {
        const { _id, ...rest } = item;
        acc[_id] = rest;
        return acc;
      }, {});
      const newDataObject = {
        data: transformedData,
      };

      return newDataObject.data;
    } catch (error) {
      console.error(error);
      return new RpcException('Error fetching linked accounts');
    }
  }

  async getByIdLinkedAccount(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');

    if (!user || user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const linkedAccount = await this.linkedAccountModel
      .findById({
        _id: new toObjectId(id),
      })
      .select({ vendor: 1, website: 1, email: 1, proxies: 1, _id: 0 });
    if (!linkedAccount) {
      return new RpcException('linked-Account not found');
    }
    if (
      !linkedAccount ||
      linkedAccount.vendor.toString() !== user.id.toString()
    ) {
      return new RpcException('linked Account  not found');
    }
    return linkedAccount;
  }

  async updateLinkedAccount(
    model: LINKED_ACCOUNT_DTOS.linkedAccountUpdateDto & { id: string },
  ) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');

    if (!user || user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      const linkedAccount = await this.linkedAccountModel.findById(model.id);
      if (!linkedAccount) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'Linked-Account not found',
              path: 'unknown',
            },
          ],
        });
      }
      if (
        !linkedAccount ||
        linkedAccount.vendor.toString() !== user.id.toString()
      ) {
        return new RpcException('linked Account  not found');
      }
      if (model.email) {
        const encryptEmail = await encryptData(model.email);
        linkedAccount.email = encryptEmail.encryptedData;
      }

      if (model.twoFA) {
        linkedAccount.twoFA = model.twoFA;
      }
      if (model.proxies) {
        linkedAccount.proxies = model.proxies;
      }
      if (model.currency) {
        linkedAccount.currency = model.currency;
      }
      if (model.website) {
        linkedAccount.website = model.website;
      }
      if (model.password) {
        const encryptPassword = await encryptData(model.password);
        linkedAccount.password = encryptPassword.encryptedData;
        function getValue(property) {
          return (
            linkedAccount.proxies?.[property] || model.proxies?.[property] || ''
          );
        }
        const gcrsProxies = {
          country: getValue('country'),
          state: getValue('state'),
          city: getValue('city'),
        };
        const payload = {
          new_password: model.password,
          proxy: gcrsProxies,
        };
        const base_url = process.env.BASE_URL_GCRS;
        console.log('payload', payload);
        const apiEndpoint = `${base_url}/gcrs/api/v1/accounts`;
        const urlWithQuery = `${apiEndpoint}/${linkedAccount.externalId}`;
        const options = {
          method: 'PUT',
          url: urlWithQuery,
          data: payload,
        };
        const logsPayload = {
          request: options,
          API: ApiType.PUT,
          serviceName: 'gcrs',
          requestType: RequestType.Outbound,
          userId: user._id,
        };
        try {
          logsPayload['requestTimeStamp'] = new Date().toISOString();

          const response = await axios(options);
          logsPayload['response'] = response?.data;
          logsPayload['responseTimeStamp'] = new Date().toISOString();
          this.giftXdLogService.createGifXdLogs(logsPayload);
        } catch (error) {
          logsPayload['exception'] = error?.response?.data;
          logsPayload['responseTimeStamp'] = new Date().toISOString();
          this.giftXdLogService.createGifXdLogs(logsPayload);
          console.log('Error while updating account.', error.message);
        }
      }
      await linkedAccount.save();
      return 'Updated successfully ';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async deleteLinkedAccount(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (!user || user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      const linkedAccountToDelete = await this.linkedAccountModel.findById(id);
      if (!linkedAccountToDelete)
        if (
          !linkedAccountToDelete ||
          linkedAccountToDelete.vendor.toString() !== user.id.toString()
        ) {
          return new RpcException('linked Account  not found');
        }

      const base_url = process.env.BASE_URL_GCRS;
      const apiEndpoint = `${base_url}/gcrs/api/v1/accounts`;
      const urlWithQuery = `${apiEndpoint}/${linkedAccountToDelete.externalId}`;
      const options = {
        method: 'DELETE',
        url: urlWithQuery,
      };
      const logsPayload = {
        request: options,
        API: ApiType.DELETE,
        serviceName: 'gcrs',
        requestType: RequestType.Outbound,
        userId: user._id,
      };
      logsPayload['requestTimeStamp'] = new Date().toISOString();

      try {
        const response = await axios(options);
        logsPayload['response'] = response?.data;
        logsPayload['responseTimeStamp'] = new Date().toISOString();
        this.giftXdLogService.createGifXdLogs(logsPayload);
      } catch (error) {
        logsPayload['exception'] = error?.response?.data;
        logsPayload['responseTimeStamp'] = new Date().toISOString();
        this.giftXdLogService.createGifXdLogs(logsPayload);
        console.error('Error deleting account:', error.message);
      }
      const linkedAccount = await this.linkedAccountModel.findByIdAndDelete(id);
      if (!linkedAccount) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'Linked-Account not found',
              path: 'id',
            },
          ],
        });
      }
      return 'Account deleted';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async verifyAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountVerify) {
    if (model.secretKey !== process.env.GCRS_KEY) {
      return new RpcException('Invalid secret key');
    }
    const logsPayload = {
      request: model,
      API: ApiType.POST,
      serviceName: 'gcrs',
      requestType: RequestType.Inbound,
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    const account = await this.linkedAccountModel.findById(
      new toObjectId(model.id),
    );
    if (!account) {
      logsPayload['exception'] = 'Account not found';
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return new RpcException('Account not found');
    }
    account.externalId = model.accountId;
    await account.save();
    logsPayload['response'] = 'Account verified successfully';
    logsPayload['responseTimeStamp'] = new Date().toISOString();
    this.giftXdLogService.createGifXdLogs(logsPayload);
    return 'Account verified successfully';
  }

  async retrieveAccountGcrs({ id, token }) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (!user || user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    const logsPayload = {
      API: ApiType.POST,
      serviceName: 'gcrs',
      requestType: RequestType.Inbound,
    };
    try {
      const account = await this.linkedAccountModel.findById(
        new toObjectId(id),
      );
      if (!account) {
        throw new RpcException('Account not found');
      }
      if (account.vendor.toString() !== user._id.toString()) {
        console.log(account.vendor.toString(), user._id.toString());
        return new RpcException('Account not found');
      }
      const base_url = process.env.BASE_URL_GCRS;
      const apiEndpoint = `${base_url}/gcrs/api/v1/accounts`;
      const urlWithQuery = `${apiEndpoint}/${account.externalId}`;
      const options = {
        method: 'GET',
        url: urlWithQuery,
      };
      logsPayload['request'] = options;
      logsPayload['requestTimeStamp'] = new Date().toISOString();
      console.log(urlWithQuery, 'url');
      const response = await axios(options);
      logsPayload['response'] = response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return response.data;
    } catch (error) {
      logsPayload['exception'] = error?.response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      console.error('Error retrieving account:', error);
      return new RpcException('Error retrieving account');
    }
  }

  async getAccountsGcrs({ id, token }) {
    console.log(id, token);
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (!user || user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    const logsPayload = {
      API: ApiType.GET,
      serviceName: 'gcrs',
      requestType: RequestType.Inbound,
    };
    try {
      logsPayload['requestTimeStamp'] = new Date().toISOString();
      const base_url = process.env.BASE_URL_GCRS;
      const apiEndpoint = `${base_url}gcrs/api/v1/accounts`;
      const urlWithQuery = `${apiEndpoint}?user_id=${id}`;
      const options = {
        method: 'GET',
        url: urlWithQuery,
      };
      logsPayload['request'] = options;
      const response = await axios(options);
      logsPayload['response'] = response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return response.data;
    } catch (error) {
      logsPayload['exception'] = error?.response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      console.error('Error retrieving accounts:', error, error.response.data);
      return new RpcException('Error retrieving accounts');
    }
  }
  async createLinkedAccountLimit(
    model: LINKED_ACCOUNT_LIMIT_DTOS.createLinkedAccountLimit,
  ) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    const query = { vendor: model.vendor };
    const accountLimitExist = await this.linkedAccountLimitModel.findOne(query);

    if (accountLimitExist) {
      for (const field in model) {
        if (model.hasOwnProperty(field)) {
          if (field in accountLimitExist) {
            accountLimitExist[field] = model[field];
          }
        }
      }

      await accountLimitExist.save();
      return accountLimitExist;
    }
    const accountLimit = await this.linkedAccountLimitModel.create(model);
    return accountLimit;
  }
}
