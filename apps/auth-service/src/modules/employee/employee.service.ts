import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/employee';
import { roleType } from '@app/schemas/users/role.schema';

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
export class EmployeeService {
  constructor(
    @InjectModel(USER_MODELS.Employee.name)
    private employeeModel: Model<USER_MODELS.Employee>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
    @InjectModel(USER_MODELS.Supervisor.name)
    private supervisorModel: Model<USER_MODELS.Supervisor>,
  ) {}

  async createEmployee(model: USER_DTOS.CreateEmployeeDto) {
    const isExist = await this.userModel.findOne({
      email: model.email,
    });
    if (isExist) {
      throw new RpcException('Employee already exist');
    }
    const role = await this.roleModel.findOne({
      name: roleType.Employee,
    });
    if (!role) {
      throw new RpcException('Employee Role not exist');
    }
    const [firstname, lastname = ''] = model.fullname.trim().split(' ');

    const user = await new this.userModel({
      password: hash_with_bcrypt(model.password),
      firstname: firstname,
      email: model.email,
      lastname: lastname,
      role: role._id,
      phone_number: model.phone_number,
    }).save();

    const employee_payload = {
      user: user['_id'],
      email: model.email,
      fullname: model.fullname,
      employment_type: model.employment_type,
      assign_to: model.assign_to,
      address: model.address,
      two_factor_auth: model.two_factor_auth,
      avatar: model.avatar,
    };
    const employee = await new this.employeeModel({
      ...employee_payload,
    }).save();

    const response = {
      ...employee.toObject(), // Convert the mongoose document to a plain object
      full_name: model.fullname, // Include the full_name from the input model
    };

    return response;
  }

  async getAllEmployee(query: USER_DTOS.EmployeePagingQueryDto) {
    try {
      const page_number = Number(query.page_number);
      const page_size = Number(query.page_size);
      const skip = (page_number - 1) * page_size;
      const totalEmployees = await this.employeeModel.countDocuments();
      const total_pages = Math.ceil(totalEmployees / page_size);

      const employees = await this.employeeModel
        .find()
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(page_size)
        .exec();

      if (employees?.length === 0) {
        return employees;
      }

      return {
        employees: toSearchModel(employees),
        current_page: page_number,
        total_pages: total_pages,
        total_employees: totalEmployees,
      };
    } catch (error) {
      throw new RpcException('Employees not available');
    }
  }

  //employment type: fulltime/parttime , in add employee ==> assign_to : list of supervisors and admins , in add supervisor==> assign_to : list of admins alone , created_at in listing of employee and supervisor

  async getBYIdEmployee(id: string) {
    const employee = await this.employeeModel.findOne({
      _id: new toObjectId(id),
    });
    if (!employee) {
      return new RpcException('employee not available');
    }
    return toModel(employee);
  }

  async updateEmployee(id: string, model: USER_DTOS.UpdateEmployeeDto) {
    console.log('Received ID:', id); // Add this line
    try {
      // Validate and convert the ID
      if (!Types.ObjectId.isValid(id)) {
        throw new RpcException('Invalid ID format');
      }
      const objectId = new Types.ObjectId(id);

      // Filter out undefined or null values
      Object.keys(model).forEach((key) => {
        if (model[key] === undefined || model[key] === null) {
          delete model[key];
        }
      });

      // Find employee by ID and update
      const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
        id,
        model,
        { new: true, runValidators: true },
      );

      if (!updatedEmployee) {
        throw new RpcException('Employee not found');
      }

      return updatedEmployee;
    } catch (error) {
      // Enhanced error logging
      console.error('Update Employee Error:', error);
      throw new RpcException(`Update failed: ${error.message}`);
    }
  }

  async deleteEmployee(id: string) {
    const employee = await this.employeeModel.findByIdAndDelete(id);
    if (!employee) {
      return new RpcException('employee not found');
    }

    return 'employee deleted';
  }
  async getEmployeeTypeList() {
    return ['full-time', 'part-time'];
  }

  async getSupervisorsAdminsList() {
    const supervisors = await this.supervisorModel.find().exec(); // Fetch all supervisors
    const admins = await this.userModel.find().exec(); // Fetch all admins

    return [...supervisors, ...admins];
  }

  async searchEmployees(page: number = 1, limit: number = 10, search: string) {
    try {
      const searchTerm = search.trim();
      const isNumericSearch = /^\d+$/.test(searchTerm);

      const skip = (page - 1) * limit;

      const searchConditions: SearchCondition[] = [
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
        this.employeeModel.find(searchQuery).skip(skip).limit(limit).exec(),
        this.employeeModel.countDocuments(searchQuery),
      ]);

      const total_pages = Math.ceil(totalCount / limit);

    

      const employees = toSearchModel(result);
      if (total_pages === 0) {
        return {
          data: [],
          totalCount: 0,
          items_count: 0,
          page_number: page,
          page_size: limit
        };
      }


      return {
        employees: employees,
        total_employees: totalCount,
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
