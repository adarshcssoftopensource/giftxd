import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/supervisor';

type SearchCondition = {
  'name.first'?: RegExp;
  'name.last'?: RegExp;
  email?: RegExp;
  full_name?: RegExp;
  assign_to?: RegExp;
  phone_number?: number;
};

const toObjectId = Types.ObjectId;
@Injectable()
export class SupervisorService {
  constructor(
    @InjectModel(USER_MODELS.Supervisor.name)
    private supervisorModel: Model<USER_MODELS.Supervisor>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
  ) {}

  async createSupervisor(model: USER_DTOS.CreateSupervisorDto) {
    const isExist = await this.supervisorModel.findOne({
      email: model.email,
    });
    if (isExist) {
      throw new RpcException('Supervisor already exist');
    }

    const supervisor_payload = {
      employment_type: model.employment_type,
      full_name: model.full_name,
      email: model.email,
      assign_to: model.assign_to,
      address: model.address,
      phone_number: model.phone_number,
      password: model.password,
      two_factor_auth: model.two_factor_auth,
      avatar: model.avatar,
    };
    const supervisor = await new this.supervisorModel({
      ...supervisor_payload,
    }).save();

    return supervisor;
  }

  async getAllSupervisor(query: USER_DTOS.SupervisorPagingQueryDto) {
    try {
      const page_number = Number(query.page_number);
      const page_size = Number(query.page_size);
      const skip = (page_number - 1) * page_size;
      const totalSupervisors = await this.supervisorModel.countDocuments();
      const total_pages = Math.ceil(totalSupervisors / page_size);

      if (page_number > total_pages) {
        throw new RpcException('Invalid page number');
      }

      const supervisors = await this.supervisorModel
        .find()
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(page_size)
        .exec();

      if (supervisors?.length === 0) {
        return supervisors;
      }

      return {
        supervisors: toSearchModel(supervisors),
        current_page: page_number,
        total_pages: total_pages,
        total_supervisors: totalSupervisors,
      };
    } catch (error) {
      throw new RpcException('Supervisors not available');
    }
  }

  async getBYIdSupervisor(id: string) {
    const supervisor = await this.supervisorModel.findOne({
      _id: new toObjectId(id),
    });

    if (!supervisor) {
      return new RpcException('supervisor not available');
    }

    return supervisor;
  }

  async updateSupervisor(id: string, model: USER_DTOS.UpdateSupervisorDto) {
    try {
      // Filter out undefined or null values
      Object.keys(model).forEach((key) => {
        if (model[key] === undefined || model[key] === null) {
          delete model[key];
        }
      });

      // Find supervisor by ID and update
      const updatedSupervisor = await this.supervisorModel.findByIdAndUpdate(
        id,
        model,
        { new: true, runValidators: true },
      );

      if (!updatedSupervisor) {
        throw new RpcException('Supervisor not found');
      }

      return updatedSupervisor;
    } catch (error) {
      throw new RpcException(`Update failed: ${error.message}`);
    }
  }


  async deleteSupervisor(id: string) {
    const supervisor = await this.supervisorModel.findByIdAndDelete(id);
    if (!supervisor) {
      return new RpcException('supervisor not found');
    }

    return 'supervisor deleted';
  }

  async getAdminsList() {
    const admins = await this.userModel.find().exec(); // Fetch users with the role 'admin'
    if (!admins || admins.length === 0) {
      return new RpcException('No admins found');
    }
    return admins;
  }

  async searchSupervisors(
    page: number = 1,
    limit: number = 10,
    search: string,
  ) {
    try {
      const searchTerm = search.trim();
      const isNumericSearch = /^\d+$/.test(searchTerm);

      const skip = (page - 1) * limit;

      let searchConditions: SearchCondition[] = [
        { 'name.first': new RegExp(searchTerm, 'i') },
        { 'name.last': new RegExp(searchTerm, 'i') },
        { email: new RegExp(searchTerm, 'i') },
        { full_name: new RegExp(searchTerm, 'i') },
        // ... other search fields
      ];

      if (isNumericSearch) {
        searchConditions.push({ phone_number: parseInt(searchTerm, 10) });
      }

      const searchQuery = { $or: searchConditions };

      const [result, totalCount] = await Promise.all([
        this.supervisorModel.find(searchQuery).skip(skip).limit(limit).exec(),
        this.supervisorModel.countDocuments(searchQuery),
      ]);

      const total_pages = Math.ceil(totalCount / limit);

      if (total_pages === 0) {
        return {
          data: [],
          totalCount: 0,
          items_count: 0,
          page_number: page,
          page_size: limit
        };
      }

      // if (result.length === 0) {
      //   throw new RpcException('No supervisor found for the given search term');
      // }

      const supervisors = toSearchModel(result);
      return {
        supervisors: supervisors,
        total_supervisors: totalCount,
        current_page: Number(page),
        total_pages: total_pages,
      };
    } catch (error) {
          // Handle the exception here
      // Log the error, return a custom response, etc.
      return error; // Modify this according to your error handling strategy
    }
  }
}
